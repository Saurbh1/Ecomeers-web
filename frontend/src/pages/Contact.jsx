import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handle = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submit = (e) => {
    e.preventDefault()
    console.log('Contact:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-8 py-12'>
        <div>
          <h1 className='text-3xl font-bold mb-4'>Get in Touch</h1>
          <img src={assets.contact_img} className='w-full rounded' alt="contact" />
        </div>
        <form onSubmit={submit} className='space-y-4'>
          <input name='name' value={formData.name} onChange={handle} placeholder='Your Name' className='w-full border px-3 py-2 rounded' required />
          <input name='email' value={formData.email} onChange={handle} placeholder='Your Email' type='email' className='w-full border px-3 py-2 rounded' required />
          <textarea name='message' value={formData.message} onChange={handle} placeholder='Your Message' rows='5' className='w-full border px-3 py-2 rounded' required />
          <button className='px-6 py-2 bg-black text-white rounded'>Send Message</button>
        </form>
      </section>
    </div>
  )
}

export default Contact
