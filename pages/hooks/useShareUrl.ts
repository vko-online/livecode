import { useEffect, useState } from "react"

export default function useShareUrl (id: string) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(`${window.location.host}/${id}`)
  }, [id])
  return url
}