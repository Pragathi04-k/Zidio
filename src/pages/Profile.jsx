import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // fetch user profile info
  }, [username]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {userData && (
        <>
          <h1 className="text-3xl font-bold">{userData.username}'s Profile</h1>
          {/* list user's posts */}
        </>
      )}
    </div>
  );
};

export default Profile;
