# AI-Driven Smart Street Lighting System

An IoT-based energy optimization dashboard with XGBoost machine learning for smart city infrastructure.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd path/to/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in your browser**
   - The terminal will show a URL like: `http://localhost:5173`
   - Open this URL in your browser
   - The dashboard will load automatically

### Available Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint
```

## 📱 Using the Dashboard

### Interactive Controls

1. **Start/Pause Simulation**
   - Click "Start" to run the 24-hour simulation
   - Click "Pause" to stop at any time
   - Click "Reset" to restart from hour 0

2. **Adjust Parameters**
   - Click "Controls" button to show settings panel
   - **Traffic Density**: 0.3x (Low) to 2.0x (High)
   - **Weather Severity**: 0% (Clear) to 80% (Severe)
   - **City Size**: Small (5K lights), Medium (25K), Large (100K)
   - Click "Apply Changes & Regenerate Data" to update simulation

3. **View Metrics**
   - **Energy Saved**: Percentage and kWh saved vs traditional lighting
   - **Model R²**: Prediction accuracy (0.85-0.95 = Good to Excellent)
   - **Cost Saved**: Dollar savings over 24 hours
   - **CO₂ Reduced**: Environmental impact in kg CO₂

4. **Analyze Charts**
   - **Real-time Monitor**: Last 60 minutes of brightness and traffic
   - **System Health**: Radar chart showing 5 key performance metrics
   - **24-Hour Pattern**: Adaptive brightness responding to sunlight
   - **Energy Comparison**: Smart vs traditional consumption by hour
   - **ML Accuracy**: Predicted vs actual brightness scatter plot
   - **Validation Metrics**: R², RMSE, MAE with quality indicators
   - **Cumulative Savings**: Energy, cost, and CO₂ over time
   - **Residual Plot**: Error distribution showing model bias

## 🔬 Technical Documentation

See **[TECHNICAL_VALIDATION.md](./TECHNICAL_VALIDATION.md)** for:
- Mathematical formulas with variable definitions
- ML model validation metrics
- Literature comparison and alignment
- Sensitivity analysis
- Defense preparation guide

### Key Parameters

```typescript
{
  lampPowerRated: 60W,              // LED streetlight power
  brightnessExponent: 1.15,         // Nonlinear LED factor (α)
  driverEfficiencyLoss: 4%,         // Driver overhead
  minBrightness: 15%,               // Safety regulation floor
  energyCostPerKwh: $0.12,          // Electricity cost
  co2EmissionFactor: 0.45 kg/kWh,  // Carbon emissions
  timeIntervalMinutes: 1            // Data resolution
}
```

## 📊 Understanding the Results

### Expected Ranges (based on literature)

| Metric | Expected Range | Validation Source |
|--------|---------------|-------------------|
| Energy Savings | 50-70% | Itron Chicago: 50-75%, Bhairi et al.: 40-70% |
| R² Score | 0.85-0.95 | Very Good to Excellent model fit |
| RMSE | 2-5% | Low prediction error (brightness units) |
| Pearson r | 0.90-0.97 | Strong correlation |

### Why These Results Are Realistic

✅ **Conservative baseline**: Traditional lights at 100% for 12 hours
✅ **Safety regulations**: 15% minimum brightness enforced
✅ **Physics-based model**: P(b) = 60W × (b/100)^1.15 × 1.04
✅ **Literature-aligned**: Falls within validated 40-75% range

## 🏙️ City Size Configurations

| Size | Lights | Coverage | Est. Cost | Timeline | Annual Savings |
|------|--------|----------|-----------|----------|----------------|
| Small | 5,000 | 50 km² | $2M | 6-12 mo | $24K, 16 tonnes CO₂ |
| Medium | 25,000 | 250 km² | $10M | 12-18 mo | $66K, 48 tonnes CO₂ |
| Large | 100,000 | 1000 km² | $40M | 24-36 mo | $266K, 192 tonnes CO₂ |

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Installation Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run typecheck

# Check ESLint errors
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── SmartStreetLightingDashboard.tsx  # Main dashboard
│   ├── MetricsCards.tsx                  # Top metrics display
│   ├── ControlPanel.tsx                  # Interactive controls
│   ├── SystemSummary.tsx                 # Technical summary
│   └── charts/                           # All visualization components
├── utils/
│   ├── dataGeneration.ts                 # Synthetic data generation
│   ├── mlModel.ts                        # XGBoost simulation
│   ├── calculations.ts                   # Energy & validation metrics
│   └── powerModel.ts                     # LED physics model
├── types/
│   └── streetlight.types.ts              # TypeScript interfaces
├── config/
│   └── systemConfig.ts                   # System parameters
└── constants/
    └── cityData.ts                       # City configurations
```

## 📚 Research References

1. **Bhairi et al. (2021)**: Smart Street Lighting: IoT-Driven Innovations for Enhanced Efficiency
2. **Barua et al. (2025)**: Intelligent Streetlight Control System Using ML Algorithms
3. **Sirichai et al. (2023)**: Automated Street Light Adjustment with AI-Assisted Analytics
4. **Itron (n.d.)**: Sustainability through Streetlights: Smart LED for Carbon Reduction

## ⚠️ Limitations

- **Synthetic Data**: Uses generated data; real deployment needs actual sensors
- **Model Generalization**: Requires k-fold cross-validation for production
- **Communication Overhead**: IoT communication energy (2-3%) not fully modeled
- **Cybersecurity**: Production requires authentication and encryption
- **Local Regulations**: Minimum brightness may vary by jurisdiction (20-30%)

## 🔐 Security Note

This is a simulation/demo system. Production deployment requires:
- Secure authentication (JWT, OAuth)
- Encrypted communication (TLS 1.3)
- Intrusion detection systems
- Regular security audits

## 📄 License

This project is for educational and research purposes.

## 🙋 Support

For issues or questions:
1. Check the [TECHNICAL_VALIDATION.md](./TECHNICAL_VALIDATION.md)
2. Review error messages in browser console (F12)
3. Verify Node.js version: `node --version` (should be v18+)

---

**Built with:** React + TypeScript + Vite + Recharts + TailwindCSS
