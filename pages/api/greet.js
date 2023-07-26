export default function handler(req, res) {
  const name = req.query.name;
  res.status(200).json({ name: `Hello ${name}` });
}
