import React from "react";

function UserProfile({ user }) {
  return (
    <div className="my-2 text-center">
      <div className="p-2 d-flex d-md-block align-items-center">
        <div>
          <img
            src={user.profileImage}
            width="120"
            alt="UserProfile"
            className="rounded-circle"
          />
        </div>
        <div className="m-auto mt-md-4">
          <h4>{user.displayName}</h4>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
