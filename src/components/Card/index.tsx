import "./style.css"

export function Card({ img, title }: { img: any, title: string }) {
  return (
    <>
      <div className="card-container flex flex-col justify-start gap-2">
        <img
          className="card-image"
          src={img}
          alt="" />
        <span className="text-main_color text-2xl text-center mt-2">{title}</span>
      </div>
    </>
  )
}