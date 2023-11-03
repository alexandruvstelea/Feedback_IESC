function getAndDisplayWeeks(){
  fetch(`${URL}/weeks`, { method: "GET" })
    .then(response => response.json())
    .then(weeks => {
      const tableBody = document.querySelector("#weeksTable tbody");
      tableBody.innerHTML = '';

      weeks.forEach(week => {
        const startDate = new Date(week.start);
        const endDate = new Date(week.end);
        const formattedStartDate = `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getFullYear()}`;
        const formattedEndDate = `${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getFullYear()}`;
        const row = document.createElement("tr");
        row.innerHTML = `
        <tr>
<td>${week.id}</td>
<td>${formattedStartDate}</td>
<td>${formattedEndDate}</td>
<td>${week.semester}</td>
</tr>
                `;
        tableBody.appendChild(row);
      });
    })
    .catch(err => console.log(err));
}

function generateWeeks() {
  const form = document.getElementById("generateWeeks");
  const formData = new FormData(form);
  const url = `${URL}/weeks`;
  
  fetch(url, { method: "POST", body: formData })
    .then(response => response.json())
    .then(newSubject => { 
      console.log(newSubject); 
      form.reset(); 
      getAndDisplayWeeks()
    })
    .catch(err => console.log(err))
}

function deleteWeeks() {
  const url = `${URL}/weeks`;

  fetch(url, { method: "DELETE" })
    .then(response => { 
      getAndDisplayWeeks() 
    })
    .catch(err => console.log(err));
}

document.getElementById("yesButton").addEventListener('click', function() {
  deleteWeeks()
  modal.style.display = "none";
});
document.getElementById("noButton").addEventListener('click', function() {
  modal.style.display = "none";
});