'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [links, setLinks] = useState<any[]>([])

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    const { data } = await supabase.from('links').select('*')
    if (data) setLinks(data)
  }

  async function shorten() {
    const res = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_url: url })
    })
    const data = await res.json()
    if (data.short_url) {
      setShortUrl(data.short_url)
      fetchLinks()
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Mis enlaces</h1>
      <input
        className="border p-2 w-full my-2"
        placeholder="Pega una URL larga..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={shorten}>
        Acortar
      </button>
      {shortUrl && (
        <p className="mt-4">
          Enlace corto: <a href={shortUrl} target="_blank" className="text-blue-600">{shortUrl}</a>
        </p>
      )}
      <ul className="mt-6">
        {links.map((link) => (
          <li key={link.id}>
            {link.short_code} → {link.original_url} (clics: {link.clicks})
          </li>
        ))}
      </ul>
    </div>
  )
}
