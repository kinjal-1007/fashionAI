import React, { useRef, useState } from 'react';
import './image_generator.css';
import Default from '../assets/images.jpg';

const ImageGenerator=()=>{
  const [image_url, setImage_url]=useState("/");
  const [imageBlob, setImageBlob] = useState(null);
  const [fileName, setFileName] = useState('generated-image.png');
  let inputRef=useRef(null);
  const token=import.meta.env.VITE_API_KEY;

  const imageGenerator= async ()=>{
    if (!inputRef.current || inputRef.current.value === "") {
      console.error("Input ref is null or empty");
      return;
    }
      const data = {
        "inputs": inputRef.current.value
      };

      try{
       const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Failed to fetch image", response.statusText, errorDetails);
        return;
      }
      const blob = await response.blob();
      const image_url = URL.createObjectURL(blob);
      setImage_url(image_url);
      setImageBlob(blob);
    } catch(error) {
      console.error("Error fetching image", error);
    }
  };
  const downloadImage = () => {
    if (!imageBlob) {
      console.error("No image to download");
      return;
    }
    const link = document.createElement('a');
    link.href = URL.createObjectURL(imageBlob);
    link.download = fileName; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    return (
        <>
          <div className="image-generator">
            <div className="header">Generate your <span>AI Fashion</span> Design</div>
            <div className="img-loading">
                <div className="image"><img src={image_url==="/"?Default:image_url} alt=""></img></div>
            </div>
            <div className="prompt">
              <input ref={inputRef} type="text" id="search" className="search" placeholder='Enter design prompt' />
              <div className='generate-btn' onClick={imageGenerator}>Generate</div>
            </div>
            {image_url !== "/" && (
           <div className='download'>
            <input 
              type="text" 
              value={fileName} 
              onChange={(e) => setFileName(e.target.value)} 
              placeholder="Enter file name" 
              className='download-box'
            />
            <div className='download-btn' onClick={downloadImage}>Download</div>
          </div>
        )}
          </div>
        </>
    );
};

export default ImageGenerator;