import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, NavbarBrand } from "reactstrap";
import UserCardTile from "../components/UserCardTile";
import {
  collection,
  getFirestore,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import app from "../lib/firebase";

const db = getFirestore(app);
const Home = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    var unsubscribe;

    const collectionRef = query(
      collection(db, "meeting_users"),
      where("hidden", "==", false)
    );
    // const snapShot = await getDocs(collectionRef);
    unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      let usersData = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        usersData.push(doc.data());
      });
      setUsers(usersData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar color="warning" dark>
        <NavbarBrand>Meeting View</NavbarBrand>
        <Link href="/login">Login Page</Link>
      </Navbar>
      <div>
        <h1>Users List</h1>
        {users.map((user) => (
          <UserCardTile key={user.uid} item={user} />
        ))}
      </div>
    </>
  );
};

export default Home;
