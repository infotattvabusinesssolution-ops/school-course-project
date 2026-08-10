/**
 * Utility function to force download a file/PDF instead of opening it in browser tab
 */
export const downloadPdf = async (url, filename = "document.pdf") => {
  if (!url) return;

  const safeFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

  try {
    // 1. Prepare Cloudinary attachment URL if applicable
    let downloadUrl = url;
    if (downloadUrl.includes("cloudinary.com") && downloadUrl.includes("/upload/")) {
      if (!downloadUrl.includes("/fl_attachment")) {
        downloadUrl = downloadUrl.replace("/upload/", "/upload/fl_attachment/");
      }
    }

    // 2. Fetch file as Blob and trigger force download via DOM anchor
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = safeFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release blob memory
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (err) {
    console.warn("Blob fetch download failed, falling back to fl_attachment link:", err);
    
    // Fallback: Direct Cloudinary attachment link with download attribute
    let fallbackUrl = url;
    if (fallbackUrl.includes("cloudinary.com") && fallbackUrl.includes("/upload/")) {
      if (!fallbackUrl.includes("/fl_attachment")) {
        fallbackUrl = fallbackUrl.replace("/upload/", "/upload/fl_attachment/");
      }
    }

    const link = document.createElement("a");
    link.href = fallbackUrl;
    link.download = safeFilename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
