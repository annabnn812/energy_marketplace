import Cookies from 'cookies'
import clientPromise from "../../ABI/mongodb";
const {createHash} = require('node:crypto');

export default async function handler(req, res) {
  if (req.method == "POST"){
    const username = req.body['username']
    const password = req.body['password']
    const passwordagain = req.body['passwordagain']
    if (password != passwordagain){
        res.redirect("/home?msg=The two passwords don't match");
        return;
    }
    const client = await clientPromise;
    const db = client.db("Users");
    const users = await db.collection("Profiles").find({"Username": username}).toArray();
    if (users.length > 0){
        res.redirect("/home?msg=This deal name is already taken. Please choose another one ");
        return;
    }
    const password_hash = createHash('sha256').update(password).digest('hex');
    const currentDate = new Date().toUTCString();
    const bodyObject = {
        Username: username,
        Password: password_hash,
        Created: currentDate
    }
    await db.collection("Profiles").insertOne(bodyObject);
    const cookies = new Cookies(req, res)
    cookies.set('username', username)
    res.redirect("/profile")
  } else {
    res.redirect("/")
  }
}