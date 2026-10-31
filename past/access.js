const hasAccess = document.cookie.includes("tmprlLk=true");

if (!hasAccess) {
    window.location.href = "../index.html"
}