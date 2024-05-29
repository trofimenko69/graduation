export default function (type, id) {
    if (type === 'company') return `${process.env.CDN_COMPANY_URL}/images/${id}.jpg`;
    return `${process.env.CDN_URL}/${type}/${id}${type === 'summary' ? '.pdf' : '.jpg'}`;
}