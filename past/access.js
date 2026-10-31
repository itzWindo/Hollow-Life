const hasAccess = document.cookie.split(';').some(item => item.trim().startsWith('tmprlLk=true'));

if (!hasAccess) {
    window.location.href = "../index.html";
}