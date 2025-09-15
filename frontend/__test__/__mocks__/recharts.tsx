import React from 'react'

export const ResponsiveContainer = ({ children }: any) => (
  <div data-testid="responsive-container">{children}</div>
)

export const LineChart = ({ children }: any) => <svg data-testid="line-chart">{children}</svg>

export const Line = () => <path data-testid="line" />

export const XAxis = () => <g data-testid="x-axis" />
export const YAxis = () => <g data-testid="y-axis" />
export const Tooltip = () => <g data-testid="tooltip" />
export const CartesianGrid = () => <g data-testid="grid" />
