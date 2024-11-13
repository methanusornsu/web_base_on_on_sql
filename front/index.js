google.charts.load("current", {
  packages: ["corechart", "bar"],
});
google.charts.setOnLoadCallback(loadTable);
google.charts.setOnLoadCallback(loadTopPublishersChart);

let currentPage = 1;
const itemsPerPage = 5;
let allObjects = [];

function loadTable() {
  $.ajax({
    url: "http://localhost:3000/slist",
    type: 'GET',
    success: function (objects) {
      allObjects = objects;  // เก็บข้อมูลทั้งหมดไว้ในตัวแปร
      displayPage(1);  // แสดงหน้าแรก
      createPaginationControls();  // สร้างปุ่ม Pagination
    }
  });
}

function displayPage(page) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedObjects = allObjects.slice(start, end);  // ตัดข้อมูลตามช่วง

  let trHTML = '';
  let num = start + 1;  // เริ่มลำดับหมายเลขในแต่ละหน้า
  paginatedObjects.forEach(object => {
    trHTML += "<tr>";
    trHTML += "<td>" + num + "</td>";
    trHTML += "<td>" + object['Title'] + "</td>";
    trHTML += "<td>" + object['Developer'] + "</td>";
    trHTML += "<td>" + object['Publisher'] + "</td>";
    trHTML += "<td>" + object['Japan'] + "</td>";
    trHTML += "<td>" + object['Europe/PAL'] + "</td>";
    trHTML += "<td>" + object['North_America'] + "</td>";
    trHTML += "<td>";
    trHTML += '<a type="button" class="btn btn-info" onclick="showPsUpdateBox(\'' + object["_id"] + '\')"><i class="fas fa-edit"></i></a>';
    trHTML += '<a type="button" class="btn btn-danger" onclick="showdeletebox(\'' + object["_id"] + '\')"><i class="fas fa-trash"></i></a>';
    trHTML += "</tr>";
    num++;
  });

  document.getElementById("mytable").innerHTML = trHTML;
  createPaginationControls();  // อัปเดตปุ่ม Pagination เมื่อเปลี่ยนหน้า
}

function createPaginationControls() {
  const totalPages = Math.ceil(allObjects.length / itemsPerPage);
  const paginationDiv = document.getElementById("pagination_controls");

  paginationDiv.innerHTML = '';

  // คำนวณช่วงของหน้าที่จะแสดง
  const maxVisibleButtons = 5;
  let startPage = Math.max(currentPage - Math.floor(maxVisibleButtons / 2), 1);
  let endPage = startPage + maxVisibleButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxVisibleButtons + 1, 1);
  }

  // ปุ่มไปหน้าแรก
  if (currentPage > 1) {
    paginationDiv.innerHTML += `<button onclick="displayPage(1)" class="pagination-button">« First</button>`;
  }

  // ปุ่มไปหน้าก่อนหน้า
  if (currentPage > 1) {
    paginationDiv.innerHTML += `<button onclick="displayPage(${currentPage - 1})" class="pagination-button">‹ Prev</button>`;
  }

  // แสดงปุ่มหน้าตามช่วงที่กำหนด
  for (let i = startPage; i <= endPage; i++) {
    paginationDiv.innerHTML += `<button onclick="displayPage(${i})" class="pagination-button ${i === currentPage ? 'active' : ''}">${i}</button>`;
  }

  // ปุ่มไปหน้าถัดไป
  if (currentPage < totalPages) {
    paginationDiv.innerHTML += `<button onclick="displayPage(${currentPage + 1})" class="pagination-button">Next ›</button>`;
  }

  // ปุ่มไปหน้าสุดท้าย
  if (currentPage < totalPages) {
    paginationDiv.innerHTML += `<button onclick="displayPage(${totalPages})" class="pagination-button">Last »</button>`;
  }
}



function showPscreateBox() {
  var d = new Date();
  const date = d.toISOString().split('T')[0];
  
  Swal.fire({
    title: 'Create Data Playstation Transaction',
    html: 
     

      '<div class="mb-3"><label for="Title" class="form-label">Title</label>' +
      '<input class="form-control" id="Title" placeholder="Title"></div>' +

      '<div class="mb-3"><label for="Developer" class="form-label">Developer</label>' +
      '<input class="form-control" id="Developer" placeholder="Developer"></div>' +

      '<div class="mb-3"><label for="Publisher" class="form-label">Publisher</label>' +
      '<input class="form-control" id="Publisher" placeholder="Publisher"></div>' +

      '<div class="mb-3"><label for="Japan" class="form-label">Japan</label>' +
      '<input class="form-control" id="Japan" placeholder="Japan"></div>' +

      '<div class="mb-3"><label for="Europe/PAL" class="form-label">Europe/PAL</label>' +
      '<input class="form-control" id="Europe/PAL" placeholder="Europe/PAL"></div>' +

      '<div class="mb-3"><label for="North_America" class="form-label">North_America</label>' +
      '<input class="form-control" id="North_America" placeholder="North_America"></div>',


    focusConfirm: false,
    showCancelButton: true,
    preConfirm: () => {
      slistCreate();
    }
  });
}

function slistCreate() {

  
  const Title = document.getElementById('Title').value;
  const Developer = document.getElementById('Developer').value;
  const Publisher = document.getElementById('Publisher').value;
  const Japan = document.getElementById('Japan').value;
  const Europe_PAL = document.getElementById('Europe/PAL').value;
  const North_America = document.getElementById('North_America').value;
  if ( Title == "" || Developer == "" || Publisher == "" || Japan == "" || Europe_PAL == "" || North_America == ""){
      Swal.fire('Please input data!') 
   }
  else{
    console.log(JSON.stringify({
   
      "Title": Title,
      "Developer": Developer,
      "Publisher": Publisher,
      "Japan": Japan,
      "Europe/PAL": Europe_PAL,
      "North_America": North_America,
  
    }));
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/slist/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
     
      "Title": Title,
      "Developer": Developer,
      "Publisher": Publisher,
      "Japan": Japan,
      "Europe/PAL": Europe_PAL,
      "North_America": North_America,
    }));
  
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(
          'Success!',
          'Create Data Playstation Information Successfully!',
          'success'
        );
        loadTable();
      }
    };
  }

  
}

function showPsDelete(id) {
  console.log("Delete: ", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "http://localhost:3000/slist/delete");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "_id": id
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        'Good job!',
        'Delete Data Playstation Information Successfully!',
        'success'
      );
      loadTable();
    }
  };
}

function showdeletebox(id){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      showPsDelete(id)
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
    }
  })

}
function showPsUpdateBox(id) {
  console.log("edit", id);
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist/" + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const object = JSON.parse(this.responseText).Complaint;
      console.log("showPsUpdateBox", object);
      Swal.fire({
        title: 'Update Playstation Transaction',
        html: '<input id="_id" class="swal2-input" placeholder="OID" type="hidden" value="' + object['_id'] + '"><br>' +

          '<div class="mb-3"><label for="Title" class="form-label">Title</label>' +
          '<input class="form-control" id="Title" placeholder="Title" value="' + object['Title'] + '"></div>' +

          '<div class="mb-3"><label for="Developer" class="form-label">Developer</label>' +
          '<input class="form-control" id="Developer" placeholder="Developer" value="' + object['Developer'] + '"></div>' +

          '<div class="mb-3"><label for="Publisher" class="form-label">Publisher</label>' +
          '<input class="form-control" id="Publisher" placeholder="Publisher" value="' + object['Publisher'] + '"></div>' +

          '<div class="mb-3"><label for="Japan" class="form-label">Japan</label>' +
          '<input class="form-control" id="Japan" placeholder="Japan" value="' + object['Japan'] + '"></div>' +


          '<div class="mb-3"><label for="Europe/PAL" class="form-label">Europe/PAL</label>' +
          '<input class="form-control" id="Europe/PAL" placeholder="Europe/PAL" value="' + object['Europe/PAL'] + '"></div>' +

          '<div class="mb-3"><label for="North_America" class="form-label">North_America</label>' +
          '<input class="form-control" id="North_America" placeholder="North_America" value="' + object['North_America'] + '"></div>',


        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
          PsUpdate();
        }
      });
    }
  };
}
function loadTopJapanDatesChart() {
  const dateCounts = {};

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist");
  xhttp.send();
  xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          const objects = JSON.parse(this.responseText);

          // นับจำนวนวันที่ซ้ำกันในฟิลด์ Japan โดยกรองค่าที่ไม่ใช่ "Unreleased"
          for (let object of objects) {
              const date = object["Japan"];
              if (date && date !== "Unreleased") {  // กรอง "Unreleased"
                  dateCounts[date] = (dateCounts[date] || 0) + 1;
              }
          }

          // จัดเรียงวันที่ตามจำนวนจากมากไปน้อย และเลือกเฉพาะ 10 อันดับแรก
          const topDates = Object.entries(dateCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10);

          // เตรียมข้อมูลสำหรับกราฟเส้น
          const dataArray = [["Date", "Count"]];
          topDates.forEach((item) => {
              dataArray.push([item[0], item[1]]);
          });

          var data = google.visualization.arrayToDataTable(dataArray);

          var options = {
              title: "ช่วงเวลาที่มีผู้ใช้บริการมากที่สุด",
              titleTextStyle: {
                  color: '#333',
                  fontSize: 20,
                  bold: true,
              },
              backgroundColor: '#f9f9f9',  // พื้นหลังกราฟ
              colors: ['#4CAF50'],  // สีเส้นกราฟ
              width: 1000,
              height: 400,
              hAxis: {
                  title: "Date",
                  titleTextStyle: { color: '#333',  },
                  textStyle: { color: '#555' },
                  slantedText: true,  // หมุนข้อความแกน X
                  slantedTextAngle: 45,  // มุมของข้อความแกน X
              },
              vAxis: {
                  title: "Count",
                  titleTextStyle: { color: '#333'},
                  textStyle: { color: '#555' },
                  gridlines: { color: '#eee' }  // สีเส้นตาราง
              },
              legend: { position: "top", textStyle: { color: '#333' } },
              curveType: "function",  // เส้นกราฟโค้ง
              pointSize: 5,  // ขนาดจุดข้อมูล
              tooltip: { textStyle: { color: '#333' }, showColorCode: true },
              lineWidth: 3,  // ความหนาเส้นกราฟ
              animation: {
                  startup: true,
                  duration: 800,
                  easing: 'out'
              },
              chartArea: { width: '85%', height: '70%' },  // ขนาดพื้นที่กราฟ
              enableInteractivity: true,
          };

          var chart = new google.visualization.LineChart(document.getElementById("top_japan_dates_chart"));
          chart.draw(data, options);
      }
  };
}

// เรียกใช้ฟังก์ชัน loadTopJapanDatesChart ในตอนเริ่มต้น
google.charts.setOnLoadCallback(loadTopJapanDatesChart);


function loadTopPublishersText() {
  const publisherCounts = {};

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist");
  xhttp.send();
  xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          const objects = JSON.parse(this.responseText);

          // นับจำนวน Publisher ซ้ำ
          objects.forEach(object => {
              const publisher = object["Publisher"];
              if (publisher) {
                  publisherCounts[publisher] = (publisherCounts[publisher] || 0) + 1;
              }
          });

          // จัดเรียง Publisher ตามจำนวนมากไปน้อย และเลือกแค่ 3 อันดับแรก
          const topPublishers = Object.entries(publisherCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3);

          // แสดงผลใน HTML
          const topPublishersDiv = document.getElementById("top_publishers_text");
          topPublishersDiv.innerHTML = `<b><h5> 3 อันดับบริษัทที่ใช้บริการมากที่สุด</h5></b>`;
          topPublishers.forEach((item, index) => {
              topPublishersDiv.innerHTML += `
                  <div class="publisher-item">
                      <span class="rank-icon">อันดับ ${index + 1}</span>
                      <div class="publisher-details">
                          <span class="publisher-name">${item[0]}</span>
                          <span class="publisher-count">${item[1]} ครั้ง</span>
                      </div>
                  </div>
              `;
          });
      }
  };
}

function searchTable() {
  const input = document.getElementById("searchInput").value.toLowerCase(); // คำค้นหาที่พิมพ์ในช่องค้นหา
  const table = document.getElementById("mytable"); // ตารางที่จะแสดงผลลัพธ์การค้นหา
  const rows = table.getElementsByTagName("tr"); // แถวทั้งหมดในตาราง

  for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td"); // เซลล์ในแต่ละแถว
      let found = false;

      // ค้นหาคำที่ตรงในแต่ละเซลล์ของแถว
      for (let j = 0; j < cells.length; j++) {
          if (cells[j].innerText.toLowerCase().includes(input)) {
              found = true;
              break;
          }
      }

      // แสดงหรือซ่อนแถวตามผลการค้นหา
      rows[i].style.display = found ? "" : "none";
  }
}




// เรียกใช้ฟังก์ชัน loadTopPublishersText เมื่อหน้าเว็บโหลดเสร็จ
window.onload = loadTopPublishersText;




function loadTopPublishersChart() {
  const publisherCounts = {};

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:3000/slist");
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      // นับจำนวน Publisher ซ้ำ
      for (let object of objects) {
        const publisher = object["Developer"];
        if (publisher) {
          publisherCounts[publisher] = (publisherCounts[publisher] || 0) + 1;
        }
      }

      // แปลงข้อมูลเป็น array และเรียงข้อมูลจากมากไปน้อย
      const sortedPublishers = Object.entries(publisherCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // เลือกแค่ 5 อันดับแรก

      // เตรียมข้อมูลสำหรับกราฟ
      const dataArray = [["Developer", "Count", { role: "style" }]];
      const colors = ["#4A90E2", "#50E3C2", "#F5A623", "#D0021B", "#BD10E0"];
      sortedPublishers.forEach((item, index) => {
        dataArray.push([item[0], item[1], `color: ${colors[index]}; stroke-width: 4; fill-opacity: 0.8`]);
      });

      var data = google.visualization.arrayToDataTable(dataArray);

      var options = {
        title: "5 ทีมพัฒนาระบบที่ใช้บริการมากที่สุด",
        titleTextStyle: {
          color: '#333',
          fontSize: 20,
          bold: true,
        },
        backgroundColor: '#ffffff',
        width: 450,
        height: 300,
        bar: { groupWidth: "85%" },
        legend: { position: "none" },
        chartArea: { width: '80%', height: '75%' },
        hAxis: {
          textStyle: { color: '#555', fontSize: 12, bold: true },
          titleTextStyle: { color: '#333', bold: true, italic: false },
        },
        vAxis: {
          gridlines: { color: '#e9e9e9' },
          textStyle: { color: '#555', fontSize: 12 },
        },
        tooltip: { textStyle: { color: '#333' } },
        animation: {
          startup: true,
          duration: 1000,
          easing: 'out',
        },
        annotations: {
          textStyle: {
            fontSize: 14,
            bold: true,
            opacity: 0.9,
            color: '#444',
          },
        },
      };

      var chart = new google.visualization.ColumnChart(document.getElementById("top_publishers_chart"));
      chart.draw(data, options);
    }
  };
}



function PsUpdate() {

  const _id = document.getElementById('_id').value;
  const Title = document.getElementById('Title').value;
  const Developer = document.getElementById('Developer').value;
  const Publisher = document.getElementById('Publisher').value;
  const Japan = document.getElementById('Japan').value;
  const Europe_PAL = document.getElementById('Europe/PAL').value;
  const North_America = document.getElementById('North_America').value;


  console.log(JSON.stringify({
    "_id": _id,
    "Title": Title,
    "Developer": Developer,
    "Publisher": Publisher,
    "Japan": Japan,
    "Europe/PAL": Europe_PAL,
    "North_America": North_America,
  }));


  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "http://localhost:3000/slist/update");
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "_id": _id,
    "Title": Title,
    "Developer": Developer,
    "Publisher": Publisher,
    "Japan": Japan,
    "Europe/PAL": Europe_PAL,
    "North_America": North_America,
  }));



  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      Swal.fire(
        'success!',
        'Data Playstation Information Successfully!',
        'success'
      );
      loadTable();
    }
  };
}