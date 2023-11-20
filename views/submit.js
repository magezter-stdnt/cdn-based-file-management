// Client side unique ID - This could and probably should move to server with UUID
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

document.getElementById("submitBtn").addEventListener("click", () => {
  let postid = uuidv4();
  let inputElem = document.getElementById("imgfile");
  let file = inputElem.files[0];
  let currentName = file.name;
  currentName = currentName.split(".")[0];
  // Create new file so we can rename the file
  let blob = file.slice(0, file.size, "image/jpeg");
  newFile = new File([blob], `${postid}_post_${currentName}.jpeg`, { type: "image/jpeg" });
  // Build the form data - You can add other input values to this i.e descriptions, make sure img is appended last
  let formData = new FormData();
  formData.append("imgfile", newFile);
  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then(() => {
      setTimeout(function(){ location.reload(); }, 3000);
      alert("File berhasil diupload");
      location.reload();
    });
});
  


// Loads the posts on page load
function loadPosts() {
  fetch("/upload")
    .then((res) => res.json())
    .then((x) => {
      for (y = 0; y < x[0].length; y++) {
        // Create a container div for each image and buttons
        const containerDiv = document.createElement("div");
        console.log("View button clicked for image", x[0][y].id);

        // Menentukan apakah file yang diupload adalah gambar atau bukan
        const newimg = document.createElement("img");
        newimg.setAttribute("src", "http://34.110.138.14/" + x[0][y].id);
        newimg.setAttribute("width", 200);
        newimg.setAttribute("height", 200);
        newimg.setAttribute("alt", "Image");
        newimg.id = x[0][y].id;

        // Menampilkan nama file
        const currentNameBtn = document.createElement("button");
        currentNameBtn.textContent = "Who-Am-I";
        // Cek apakah nama file mengandung "_post_"
        // Jika iya, maka tampilkan nama file setelah "_post_"
        // Jika tidak, maka tampilkan nama file

        // currentNameBtn.id = x[0][y].id.includes("_post_") ? x[0][y].id.split("_post_")[1].split(".")[0] : x[0][y].id.split(".")[0]; // tidak ada extension
        currentNameBtn.id = x[0][y].id.includes("_post_") ? x[0][y].id.split("_post_")[1] : x[0][y].id; // ada extension

        currentNameBtn.addEventListener("click", () => {
          alert(event.srcElement.id);
          console.log("Current name button clicked for image", event.srcElement.id);
        });

        // Create view button
        const viewBtn = document.createElement("button");
        viewBtn.textContent = "View";
        viewBtn.id = x[0][y].id;
        viewBtn.addEventListener("click", () => {
          // Add logic for viewing image
          viewFile(event.srcElement.id);
          console.log("View button clicked for image", event.srcElement.id);
        });

        // Create rename button
        const renameBtn = document.createElement("button");
        renameBtn.textContent = "Rename";
        renameBtn.id = x[0][y].id;
        renameBtn.addEventListener("click", () => {
          // Add logic for renaming image
          renameFile(event.srcElement.id);
          console.log("Rename button clicked for image", event.srcElement.id);
        });

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.id = x[0][y].id;
        deleteBtn.addEventListener("click", () => {
          // Add logic for deleting image
          deleteFile(event.srcElement.id);
          console.log("Delete button clicked for image", event.srcElement.id);
        });

        // Append elements to the container div
        containerDiv.appendChild(newimg);
        containerDiv.appendChild(currentNameBtn);
        containerDiv.appendChild(viewBtn);
        containerDiv.appendChild(renameBtn);
        containerDiv.appendChild(deleteBtn);

        // Append the container div to the "images" div
        document.getElementById("images").appendChild(containerDiv);
      }
    });
}

// View file
function viewFile(id) {
  window.open("http://34.110.138.14/" + id);
}

// Rename file
function renameFile(id) {
  let newname = prompt("Please enter a new name for the file");
  if (newname != null) {
    let postid = uuidv4();
    if(newname.includes(".")){
      let newname = newname.split(".")[0];
    }

    let namabaru = `${postid}_post_${newname}.jpeg`;
    console.log("namaBaru", namabaru);

    fetch("/rename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, namabaru: namabaru }),
    }).then(() => {
      setTimeout(function(){ location.reload(); }, 3000);
      alert("File berhasil diubah");
      location.reload();
    });
  }
}

// Delete file
function deleteFile(id) {
  fetch("/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  }).then(() => {
      setTimeout(function(){ location.reload(); }, 3000);
      alert("File berhasil dihapus");
      location.reload();
  });
}
