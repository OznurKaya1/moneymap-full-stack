import React from 'react'
import { Link } from 'react-router-dom'

export default function DashboardCard({ to, label, img, alt }) {
  return (
    <Link to={to} className="dashboard-link">
      <span>{label}</span>
      <img src={img} alt={alt} className="dashboard-icon" />
    </Link>
  )
}
