type InfoProps = {
  text: string
}

function Info({ text }: InfoProps) {
  return (
    <span className="info-wrapper">
      <span className="info-button">i</span>

      <span className="tooltip">
        {text}
      </span>
    </span>
  )
}

export default Info