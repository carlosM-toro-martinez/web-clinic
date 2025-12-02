import React from "react";
import LayoutComponent from "../../../components/LayoutComponent";
import BackArrow from "../../../components/common/BackArrow";
import FormMovementComponent from "../../../components/FormMovementComponent"; // ruta igual que LayoutComponent
import { useLocation } from "react-router-dom";

function MovimientoCaja() {
  const location = useLocation();
  const cashRegisterId = location.state?.cashRegisterId;

  return (
    <LayoutComponent>
      <BackArrow />
      <FormMovementComponent cashRegisterId={cashRegisterId} />
    </LayoutComponent>
  );
}

export default MovimientoCaja;

// <div className="container py-12 flex justify-center">
//   <div className="w-full max-w-xl card">
//     <header className="mb-6">
//       <h2 className="text-3xl font-bold">Record Cash Movement</h2>
//       <p className="text-[var(--text-muted)] mt-1">
//         Enter the details of the income or expense.
//       </p>
//     </header>

//     <form className="space-y-5">
//       <div>
//         <label className="block text-[var(--text-secondary)] mb-2">
//           Description
//         </label>
//         <input
//           type="text"
//           placeholder="e.g., Office supplies purchase"
//           className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus"
//         />
//       </div>

//       <div>
//         <label className="block text-[var(--text-secondary)] mb-2">
//           Amount
//         </label>
//         <div className="relative">
//           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
//             $
//           </span>
//           <input
//             type="number"
//             placeholder="0.00"
//             className="w-full pl-10 rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-[var(--text-secondary)] mb-2">
//             Movement Type
//           </label>
//           <select className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface)] input-focus">
//             <option>Select type...</option>
//             <option>Ingreso</option>
//             <option>Egreso</option>
//           </select>
//         </div>
//       </div>

//       <div>
//         <label className="block text-[var(--text-secondary)] mb-2">
//           Attachment (Optional)
//         </label>
//         <div className="rounded-xl border-2 border-dashed border-[var(--color-border)] p-8 text-center text-[var(--text-muted)]">
//           <div className="mb-2 text-3xl text-[var(--color-primary)]">
//             <span className="material-symbols-outlined">
//               cloud_upload
//             </span>
//           </div>
//           <p>
//             <a className="text-[var(--color-primary)] font-medium">
//               Upload a file
//             </a>{" "}
//             or drag and drop
//           </p>
//           <p className="text-xs mt-1 text-[var(--text-muted)]">
//             PNG, JPG, PDF up to 10MB
//           </p>
//         </div>
//       </div>

//       <div>
//         <button type="submit" className="btn-primary w-full py-3 text-lg">
//           Save Movement
//         </button>
//       </div>
//     </form>
//   </div>
// </div>
