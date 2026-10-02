import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('texora_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('texora_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity) || 1)
    const price = product.price || 499

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product._id === product._id)
      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        }
        toast.success(`Updated quantity of "${product.name}" in cart!`)
        return updated
      } else {
        toast.success(`Added "${product.name}" to cart!`)
        return [
          ...prevCart,
          {
            product: {
              _id: product._id,
              name: product.name,
              image: product.image,
              price: price,
              category: product.category,
            },
            quantity: qty,
            price: price,
          },
        ]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (productId, newQty) => {
    const qty = parseInt(newQty)
    if (qty <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity: qty } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price || 499) * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
