const cafeList = document.querySelector("#cafe-list")
const form = document.querySelector("#add-cafe-form")
const searchCafe = document.querySelector("#search-cafe")

// getting data
// db.collection("cafes").where("city", "==", "Manchester").orderBy("name").get()
//   .then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//       // console.log(doc.data())
//       renderCafe(doc)
//     })
//   })

// saving data
form.addEventListener("submit", (e) => {
  e.preventDefault()
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value
  })

  // clear input form
  form.name.value = ""
  form.city.value = ""
})

// searching data
searchCafe.addEventListener("submit", (e) => {
  e.preventDefault()
  cafeList.innerHTML = ""
  db.collection("cafes").where("city", "==", searchCafe.keyword.value).get()
    .then((snapshot) => {
      snapshot.docs.forEach(doc => {
        renderCafe(doc)
      })
    })
})


// create element and render cafe
function renderCafe(doc) {

  let li = document.createElement("li")
  let name = document.createElement("span")
  let city = document.createElement("span")
  let cross = document.createElement("div")

  li.setAttribute("data-id", doc.id)
  name.textContent = doc.data().name
  city.textContent = doc.data().city
  cross.textContent = "x"

  li.appendChild(name)
  li.appendChild(city)
  li.appendChild(cross)

  cafeList.appendChild(li)

  // deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation() // stop event bubbling up
    let id = e.target.parentElement.getAttribute("data-id")
    db.collection("cafes").doc(id).delete()
  })
}

// real-time listener
db.collection("cafes").orderBy("name").onSnapshot(snapshot => {
  let changes = snapshot.docChanges()
  changes.forEach(change => {
    if (change.type === "added") {
      renderCafe(change.doc)
    } else if (change.type === "removed") {
      // cari element li yang sudah dihapus di firestore dan hapus di element cafe-list
      let li = cafeList.querySelector(`[data-id="${change.doc.id}"]`)
      cafeList.removeChild(li)
    }
  })
})