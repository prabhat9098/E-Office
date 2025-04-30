// Api/applicationFormsubapi.js

async function submitApplication(formData) {
    try {
      const response = await fetch("https://eoffice.riddleescape.in/applications/application.php", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }
  