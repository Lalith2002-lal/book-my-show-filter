function header_Footer_Loading_Function() {
  // Function to load HTML content
  const loadContent = async (url, elementId) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error("Error loading content:", error);
    }
  };

  // Load header content
  loadContent("header.html", "head_content");

  // Load footer content
  loadContent("footer.html", "footer_content");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export { header_Footer_Loading_Function };
