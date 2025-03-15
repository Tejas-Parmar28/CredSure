import React from "react";
export function FeaturedImageGallery() {
  const data = [
    {
      imgelink:
        "https://slidebazaar.com/wp-content/uploads/2020/05/PowerPoint-Certificate-Template.jpg",
    },
    {
      imgelink:
        "https://www.slideegg.com/appreciation-certificate-template-ppt",
    },
    {
      imgelink:
        "https://www.slideegg.com/image/catalog/477793-certificate%20of%20training%20template%20ppt.png",
    },
    {
      imgelink:
        "https://www.slideegg.com/image/catalog/87187-Student%20Certificate%20Template.png",
    },
    {
      imgelink:
        "https://www.slideegg.com/image/catalog/477558-certificate%20template%20ppt%20free%20download.png",
    },
  ];

  const [active, setActive] = React.useState(
    "https://www.slideegg.com/image/catalog/477793-certificate%20of%20training%20template%20ppt.png"
  );

  return (
    <div className="grid gap-4">
      <div>
        <img
          className=" max-w-full rounded-lg  object-center h-[45vh] "
          src={active}
          alt=""
        />
      </div>
      <div className="grid grid-cols-5 gap-4 ">
        {data.map(({ imgelink }, index) => (
          <div key={index}>
            <img
              onClick={() => setActive(imgelink)}
              src={imgelink}
              className="h-20 cursor-pointer rounded-lg object-cover object-center"
              alt="gallery-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
