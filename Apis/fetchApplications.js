let allApplications = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchApplications();

  // Bind filter inputs
  document.getElementById("searchInput")?.addEventListener("input", renderTable);
  document.getElementById("applicationTypeFilter")?.addEventListener("change", renderTable);
  document.getElementById("departmentFilter")?.addEventListener("change", renderTable);
  document.getElementById("dateFilter")?.addEventListener("change", renderTable);
});

function fetchApplications() {
  fetch('https://eoffice.riddleescape.in/applications/application.php')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.data)) {
        allApplications = data.data;
        renderTable(); // call to populate table initially
      } else {
        console.error("Unexpected data format:", data);
      }
    })
    .catch(error => {
      console.error('Error fetching applications:', error);
    });
}

function renderTable() {
  const tbody = document.getElementById("applicationTableBody");
  tbody.innerHTML = "";

  const searchInput = document.getElementById("searchInput")?.value?.toLowerCase() || "";
  const applicationTypeFilter = document.getElementById("applicationTypeFilter")?.value?.toLowerCase() || "";
  const departmentFilter = document.getElementById("departmentFilter")?.value?.toLowerCase() || "";
  const dateFilter = document.getElementById("dateFilter")?.value || "";

  const filtered = allApplications.filter(app => {
    const isMatchingSearch =
      app.application_id?.toLowerCase().includes(searchInput) ||
      app.contact_number?.toLowerCase().includes(searchInput) ||
      app.applicant_name?.toLowerCase().includes(searchInput);

    const isMatchingType =
      !applicationTypeFilter || app.applicant_type_name?.toLowerCase().includes(applicationTypeFilter);

    const isMatchingDepartment =
      !departmentFilter || app.department_name?.toLowerCase().includes(departmentFilter);

    const isMatchingDate =
      !dateFilter || app.application_date === dateFilter;

    return isMatchingSearch && isMatchingType && isMatchingDepartment && isMatchingDate;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="20" class="text-muted">No applications found.</td></tr>`;
    return;
  }

  filtered.forEach((app, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${app.application_id || ''}</td>
      <td>${app.applicant_name || ''}</td>
      <td>${app.dateofbirth || ''}</td>
      <td>${app.contact_number || ''}</td>
      <td>${app.address || ''}</td>
      <td>${app.city || ''}</td>
      <td>${app.state || ''}</td>
      <td>${app.pincode || ''}</td>
      <td>${app.subject || ''}</td>
      <td>${app.category_name || ''}</td>
      <td>${app.applicant_type_name || ''}</td>
      <td>${app.department_name || ''}</td>
      <td>${app.application_date || ''} ${app.application_time || ''}</td>
      <td>
        ${app.attachment ? `<a href="${app.attachment}" target="_blank">View File</a>` : 'No File'}
      </td>
      <td><span class="stage-select ${getStageClass(app.stage)}">${app.stage || 'N/A'}</span></td>
      <td>${convertToIST(app.updated_at) || ''}</td>
    `;

    tbody.appendChild(row);
  });
}

function getStageClass(stage) {
  switch ((stage || '').toLowerCase()) {
    case 'received': return 'stage-received';
    case 'in progress': return 'stage-in-progress';
    case 'reviewed': return 'stage-reviewed';
    case 'completed': return 'stage-completed';
    default: return '';
  }
}


function convertToIST(utcTimestamp) {
    // Create a Date object from the UTC timestamp
    const utcDate = new Date(utcTimestamp);

    // Convert the UTC time to IST (Indian Standard Time) by using the toLocaleString method
    const options = {
        timeZone: 'Asia/Kolkata', // IST time zone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    // Convert to IST and format the result
    const istDate = utcDate.toLocaleString('en-GB', options); // 'en-GB' for consistent formatting

    return istDate;
}