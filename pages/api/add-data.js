import { addDataCustom } from "../../fb/Firebase";

export default function handler(req, res) {
    let today = new Date().toISOString()
    addDataCustom(req.body.user, {encrypted: req.body.encrypted, date: today});
    res.status(200).end()
}