import {
  getAllUsers,
  getUserForId,
  getMeetingDataForUserId,
} from "../../lib/fetchFromFireStore";
import { useState, useEffect } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import Head from "next/head";

import {
  collection,
  where,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/saveToFireStore";
import { useAuth } from "../../context/AuthUserContext";
import Router from "next/router";
import AddMeetingForm from "../../components/AddMeetingForm";
import { Button, Spinner } from "reactstrap";
import { addTaskSchema, defaultTaskValues } from "../../lib/formValidate";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { saveNewTask, updateExistingTask } from "../../lib/saveToFireStore";
import MeetingTableEditable from "../../components/MeetingTableEditable";

export const AddNewMeeting = ({ postData, userData }) => {
  const meet = JSON.parse(postData);
  const [meetingData, setMeetingData] = useState(meet);
  const [progress, setProgress] = useState(false);
  const user = JSON.parse(userData);
  const { authUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !authUser) Router.push("/");
  }, [authUser, loading]);
  useEffect(() => {
    var unsubscribe;

    const collectionRef = query(
      collection(db, "meeting_schedule"),
      where("user_for", "==", user.uid),
      orderBy("time_start")
    );
    // const snapShot = await getDocs(collectionRef);
    unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      let meetings = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        let meetingObj = {
          id: doc.id,
          ...doc.data(),
        };
        meetings.push(meetingObj);
      });
      setMeetingData(meetings);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const methods = useForm({
    resolver: yupResolver(addTaskSchema),
    defaultValues: defaultTaskValues,
  });
  const onSubmit = async (data) => {
    console.log(data);

    try {
      setProgress(true);
      if (data.uid) {
        let updateData = { ...data };
        delete updateData.id;
        console.log("data before update", updateData);
        await updateExistingTask(data.id, updateData);
        //
      } else {
        const uniqueID = uuidv4();
        data.uid = uniqueID;
        console.log("data before save ", data);
        await saveNewTask(data);
      }
      setProgress(false);
      methods.reset(defaultTaskValues);
    } catch (e) {
      console.log(e);
      alert("Error in saving");
      setProgress(false);
    }
  };
  const resetForm = () => {
    methods.reset(defaultTaskValues);
  };
  return (
    <>
      <Head>
        <title>Add New Meating</title>
      </Head>
      <Navbar color="warning" dark>
        <NavbarBrand href="/">Add New Meeting For {user.name} </NavbarBrand>
      </Navbar>
      <FormProvider {...methods}>
        <h3>All Upcoming Meetings for {user.name}</h3>
        <MeetingTableEditable meetingData={meetingData} isEdit={true} />
        <h3>Add New Meeting for {user.name}</h3>
        <AddMeetingForm user={user} />
        <Button color="primary" onClick={methods.handleSubmit(onSubmit)}>
          {progress && <Spinner color="danger">Loading...</Spinner>}
          Submit
        </Button>
        <Button color="warning" onClick={resetForm}>
          Reset
        </Button>
      </FormProvider>
    </>
  );
};

export async function getStaticPaths() {
  const paths = await getAllUsers();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const user = await getUserForId(params.id);
  const result = await getMeetingDataForUserId(params.id);
  const postData = JSON.stringify(result);
  const userData = JSON.stringify(user);
  return {
    props: {
      userData,
      postData,
    },
  };
}

export default AddNewMeeting;
