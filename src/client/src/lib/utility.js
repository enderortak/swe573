const formatDateTime = (date) => {
    const d = new Date(date)
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    var hh = (d.getHours() + 100).toString().slice(-2);
    var _mm = (d.getMinutes() + 100).toString().slice(-2);
    return `${dd}.${mm}.${yyyy} ${hh}:${_mm}`;
}

const formatDate = (date) => {
    const d = new Date(date)
    var yyyy = d.getFullYear().toString();
    var mm = (d.getMonth() + 101).toString().slice(-2);
    var dd = (d.getDate() + 100).toString().slice(-2);
    return `${dd}.${mm}.${yyyy}`;
}

export {
    formatDateTime as formatDate,
    formatDate as formatDateOnly
}