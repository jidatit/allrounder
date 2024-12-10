
import { useState, useEffect } from "react";
import { collection, setDoc, doc, getDocs, deleteDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";
function SocialLinks() {
  const [links, setLinks] = useState([{
    id: 1,
    logo: null,
    url: "",
    logoUrl: null,
  }]);

  // Handle adding a new link (with URL and logo)
  const handleAddLink = () => {
    setLinks([...links, { id: Date.now(), logo: null, url: "", logoUrl: null }]);
  };

  // Handle changes in the URL field
  const handleUrlChange = (id, url) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, url: url } : link
      )
    );
  };

  // Handle changes in the logo file input
  const handleFileChange = (id, file) => {
    console.log("File selected: ", file);
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, logo: file } : link
      )
    );
  };

  // Handle saving the link (with URL and logo)
  const handleSaveLink = async (link) => {
    if (!link.url) {
      alert("URL is required.");
      return;
    }

    // Validate URL
    try {
      new URL(link.url); // Throws error if invalid
    } catch (error) {
      alert("Invalid URL format.");
      return;
    }

    if (link.logo) {
      if (link.logo instanceof File) {
        console.log("Uploading file: ", link.logo.name);
        const storageRef = ref(storage, `socialLogos/${link.logo.name}`);
        const uploadTask = uploadBytesResumable(storageRef, link.logo);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(`Progress: ${snapshot.bytesTransferred} / ${snapshot.totalBytes}`);
          },
          (error) => {
            console.error("Upload failed", error);
            message.error("Upload Failed ,Please try again")
          },
          async () => {
            if (uploadTask.snapshot.ref) {
                console.log("File uploaded successfully");
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Download URL:", downloadURL);

              const socialLinkRef = doc(collection(db, "socialLinks"));
              await setDoc(socialLinkRef, {
                url: link.url,
                logoUrl: downloadURL,
              });
              console.log("Link saved with logo!");
              message.success("Link saved with logo!")

             setLinks((prevLinks) =>
                prevLinks.map((prevLink) =>
                   prevLink.id === link.id
                     ? { ...prevLink, logoUrl: downloadURL }
                     : prevLink
                )
            );
        } else {
                           console.error("Upload reference is undefined.");
                        message.error("Upload failed! Please try again.")
        }
        }
        );
    } else {
                console.error("Selected file is not valid.");
              }
             } else {
      const socialLinkRef = doc(collection(db, "socialLinks"));
      await setDoc(socialLinkRef, {
        url: link.url,
        logoUrl: null,
      });
      console.log("Link saved without logo!");
      message.success("Link saved without logo!");
    }
  };

 
  const handleDeleteLink = async (linkId) => {
    try {
      // Delete from Firestore
      const linkDocRef = doc(db, "socialLinks", linkId.toString());
      await deleteDoc(linkDocRef);
      console.log("Link deleted from Firestore");
      message.success("Link deleted from Firestore");

      // Remove the link from the UI (state)
      setLinks(links.filter((link) => link.id !== linkId));
      console.log("Link removed from UI");
      message.success("Link deleted from UI");
    } catch (error) {
      console.error("Error deleting link: ", error);
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "socialLinks"));
        const linksData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, 
        }));
        setLinks(linksData);
      } catch (error) {
        console.error("Error fetching social links: ", error);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="w-1/2 mt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Social Links</h3>
        <button
          onClick={handleAddLink}
          className="px-2 py-2 bg-red-500 text-white rounded-full hover:bg-red-700"
        >
          Add Link
        </button>
      </div>

      {links.map((link) => (
        <div key={link.id} className="mt-6 mb-6 flex items-center gap-4">
          {/* Logo Upload */}
          <label className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full border cursor-pointer">
            {link.logoUrl ? (
              <img
                src={link.logoUrl}
                alt="Logo"
                className="w-18 h-18 object-contain rounded-full"
              />
            ) : (
              <span className="text-sm text-gray-500">
                <CameraOutlined className="text-gray-500 text-4xl" />
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(link.id, e.target.files[0])}
            />
          </label>

          {/* URL Input Field */}
          <input
            type="url"
            placeholder="Enter URL"
            value={link.url}
            onChange={(e) => handleUrlChange(link.id, e.target.value)}
            className="flex-1 border border-gray-900 rounded-full p-2"
          />

          {/* Save Button */}
          <button
            onClick={() => handleSaveLink(link)}
            className="bg-red-500 text-white px-4 py-2 rounded-full"
            
          >
            Save
            
          </button>

          {/* Delete Button */}
          <button onClick={() => handleDeleteLink(link.id)}>
            <DeleteOutlined className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default SocialLinks;








