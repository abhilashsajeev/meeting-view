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
import styles from "../styles/NavBarNew.module.css";
import { getAllUsersData } from "../lib/fetchFromFireStore";

const db = getFirestore(app);
const Home = ({ usersList }) => {
  const usersArray = JSON.parse(usersList);
  const [users, setUsers] = useState(usersArray);
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
      // if usersData is same as users, then don't update
      if (JSON.stringify(usersData) !== JSON.stringify(users)) {
        setUsers(usersData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar className={styles.header_gradient} dark>
        <NavbarBrand>Meeting View</NavbarBrand>
        <Link className={styles.white_link} href="/login">
          Login Page
        </Link>
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

export async function getStaticProps() {
  const usersList = await getAllUsersData();
  return {
    props: {
      usersList: JSON.stringify(usersList),
    },
    revalidate: 10,
  };
}

export default Home;
