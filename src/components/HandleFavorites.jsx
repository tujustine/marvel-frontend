// const HandleFavorites = () => {
//   return (
//     <>
//       {" "}
//       {data.results.map((personnage, index) => {
//         const isDefaultImage =
//           personnage.thumbnail.path ===
//             "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available" ||
//           personnage.thumbnail.path ===
//             "http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708";

//         return (
//           <div
//             className="one-character"
//             key={personnage._id + index}
//             onClick={() => navigate(`/character/${personnage._id}`)}
//           >
//             <div
//               className="character-pic-container"
//               style={{
//                 backgroundImage: isDefaultImage
//                   ? `url(${H2G2})`
//                   : `url(${personnage.thumbnail.path}.${personnage.thumbnail.extension})`,
//               }}
//             ></div>
//             <button
//               className="favorite-btn"
//               onClick={async (event) => {
//                 event.stopPropagation();
//                 if (isLogin) {
//                   const newTab = [...favorites];
//                   if (!favorites.includes(personnage._id)) {
//                     newTab.push(personnage._id);
//                     setFavorites(newTab);
//                     const comicOrCharacter = personnage;
//                     const type = "character";

//                     try {
//                       await axios.post(
//                         `${import.meta.env.VITE_API_URL}/favorite`,
//                         { comicOrCharacter, type },
//                         {
//                           headers: { authorization: `Bearer ${token}` },
//                         }
//                       );
//                     } catch (error) {
//                       console.log(error);
//                     }
//                   } else {
//                     const index = newTab.indexOf(personnage._id);
//                     if (index !== -1) {
//                       newTab.splice(index, 1);
//                       setFavorites(newTab);

//                       const comicOrCharacter = personnage;
//                       const type = "character";

//                       try {
//                         await axios.post(
//                           `${import.meta.env.VITE_API_URL}/favorite`,
//                           { comicOrCharacter, type },
//                           {
//                             headers: {
//                               authorization: `Bearer ${token}`,
//                             },
//                           }
//                         );
//                       } catch (error) {
//                         console.log(error);
//                       }
//                     }
//                   }
//                 } else {
//                   setVisibleLogin(true);
//                 }
//               }}
//             >
//               {!favorites.includes(personnage._id) ? (
//                 <BsBalloonHeart />
//               ) : (
//                 <BsBalloonHeartFill className="fav-added" />
//               )}
//             </button>

//             <h3
//               className="characters-name"
//               onClick={(event) => {
//                 event.stopPropagation();
//               }}
//             >
//               {personnage.name}
//             </h3>
//             {personnage.description && (
//               <p className="character-description">{personnage.description}</p>
//             )}
//           </div>
//         );
//       })}
//     </>
//   );
// };

// export default HandleFavorites;
