"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    description?: string
    className?: string
}

export function Dialog({ isOpen, onClose, children, title, description, className }: DialogProps) {
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        if (isOpen) document.body.style.overflow = "hidden"
        else document.body.style.overflow = "unset"
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn(
                            "relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden",
                            className
                        )}
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    {title && <h2 className="text-2xl font-black text-slate-900 leading-tight">{title}</h2>}
                                    {description && <p className="text-sm font-medium text-slate-500 mt-1">{description}</p>}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
