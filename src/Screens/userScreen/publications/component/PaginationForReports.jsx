import React from 'react'
import { Grid } from '@mui/material'
import { IoCaretForward, IoCaretBack } from "react-icons/io5";

function PaginationForReports({ currentPage, totalPages, onPageChange, itemsPerPage }) {
    return (
        <Grid container justifyContent='flex-end' sm={12}>
            <div className="flex items-center justify-end gap-8 mt-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-md   text-center text-sm transition-all shadow-sm  text-slate-600 hover:text-white:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    <IoCaretBack className='text-md' />
                </button>

                <p className="text-slate-600 text-sm">
                    Page <strong className="text-slate-600">{currentPage}</strong> of&nbsp;<strong className="text-slate-600">{totalPages}</strong>
                </p>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-md   text-center text-sm transition-all shadow-sm  text-slate-600 hover:text-white:border-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                >
                    <IoCaretForward />
                </button>
            </div>
        </Grid>
    )
}


export default PaginationForReports