import React from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

function GuestSection({ handleSignInButton }) {
  return (
    <React.Fragment>
      <Navbar handleSignInButton={handleSignInButton} />
      <Header handleSignInButton={handleSignInButton} />
    </React.Fragment>
  );
}

export default GuestSection;

// <div className="container">
//         <div className="row mt-5">
//           <div className="col-md-4 card m-auto">
//             <div className="card-content mb-2">
//               <h4 className="text-center py-4">Welcome User!</h4>
//               <button
//                 onClick={handleSignInButton}
//                 className="btn btn-primary btn-block"
//               >
//                 Login with Google
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
