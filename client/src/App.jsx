import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  // Handler for when a user selects a file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Handler for when the user clicks the "Upload" button
  const handleUpload = async () => {
    setLoading(true);

    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // Send a POST request to your server to upload the image
      const response = await axios.post(
        "http://localhost:8000/api/images/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the response from the server (e.g., display a success message)
      console.log("Image uploaded successfully:", response.data);
      setStatus(!status);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      // Handle errors (e.g., display an error message)
      console.error("Error uploading image:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Fetch image file names from your API endpoint
    axios
      .get("http://localhost:8000/api/images/")
      .then((response) => {
        setImages(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        console.error("Error fetching image file names:", error);
      });
  }, [status]);

  const handleDelete = (id) => {
    setLoading(true);

    axios
      .delete(`http://localhost:8000/api/images/${id}`)
      .then((response) => {
        setStatus(!status);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);

        console.error("Error fetching image file names:", error);
      });
  };

  return (
    <>
      {!loading ? (
        <>
          <div>
            <h2>Image Upload</h2>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            <button onClick={handleUpload}>Upload</button>
          </div>

          <div className="" style={{ display: "flex" }}>
            {images?.map(({ imagePath, _id }) => {
              return (
                <div className="">
                  <img
                    width={"300px"}
                    height={"300px"}
                    src={`http://localhost:8000/${imagePath}`}
                    alt={imagePath}
                  />
                  <div className="">
                    <span style={{ widows: "200px" }}>{imagePath}</span>
                    <br />
                    <br />
                    <span
                      onClick={() => handleDelete(_id)}
                      style={{ color: "red" }}
                    >
                      delete
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        "loading...."
      )}
    </>
  );
}

export default App;
