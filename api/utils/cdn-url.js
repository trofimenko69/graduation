export default function (who, type, id) {
    if (who === 'company') return `${process.env.CDN_COMPANY_URL}/${type}/${id}.jpg`;
    else return`${process.env.CDN_URL}/logo/${id}.pdf`;
}