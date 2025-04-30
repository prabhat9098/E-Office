const CATEGORY_API_URL = "https://eoffice.riddleescape.in/categories/category.php";
let selectedCategoryId = null;

// Fetch categories (already defined)
async function fetchCategories() {
  try {
    const response = await fetch(CATEGORY_API_URL);
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.warn("Unexpected API response structure:", result);
      return [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    alert("Error fetching categories.");
    return [];
  }
}

// ✅ Load categories into <select>
async function populateCategoryDropdown() {
  const categories = await fetchCategories();
  const dropdown = document.getElementById("categoryDropdown");

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    dropdown.appendChild(option);
  });
}

// Call it on page load
window.addEventListener("DOMContentLoaded", () => {
  populateCategoryDropdown();
});



const DEPARTMENT_API_URL = "https://eoffice.riddleescape.in/departments/department.php";
const APPLICATION_TYPE_API_URL = "https://eoffice.riddleescape.in/applicant_types/applicant_type.php";

// Fetch Departments
async function fetchDepartments() {
  try {
    const response = await fetch(DEPARTMENT_API_URL);
    const result = await response.json();
    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Error fetching departments:", error);
    alert("Error fetching departments.");
    return [];
  }
}

// Fetch Application Types
async function fetchApplicationTypes() {
  try {
    const response = await fetch(APPLICATION_TYPE_API_URL);
    const result = await response.json();
    return result.success && Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Error fetching application types:", error);
    alert("Error fetching application types.");
    return [];
  }
}

// Load into dropdown
async function populateDropdown(dropdownId, dataList) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.innerHTML = '<option disabled selected value="">Select</option>'; // Reset with default
  dataList.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
}

// Call all on page load
window.addEventListener("DOMContentLoaded", async () => {
  const [categories, departments, appTypes] = await Promise.all([
    fetchCategories(),
    fetchDepartments(),
    fetchApplicationTypes()
  ]);

  populateDropdown("categoryDropdown", categories);
  populateDropdown("departmentDropdown", departments);
  populateDropdown("applicationTypeDropdown", appTypes);
});
