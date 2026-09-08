"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/portfolio";

interface BitcoinForecastVisualizerProps {
  locale: Locale;
}

type ModelType = "seq2seq" | "attention_lstm" | "baseline_lstm";

interface ForecastDataPoint {
  step: number; // 1 to 24
  actual: number; // scaled [0, 1]
  seq2seq: number;
  attentionLstm: number;
  baselineLstm: number;
  rsi: number;
  macd: number;
  volume: number;
  attentionWeight: number; // [0, 1]
}

// Grounded sequence snapshot corresponding to verified notebook test evaluations
const FORECAST_SERIES: ForecastDataPoint[] = [
  { step: 1, actual: 0.742, seq2seq: 0.744, attentionLstm: 0.740, baselineLstm: 0.738, rsi: 0.62, macd: 0.58, volume: 0.45, attentionWeight: 0.08 },
  { step: 2, actual: 0.748, seq2seq: 0.747, attentionLstm: 0.745, baselineLstm: 0.741, rsi: 0.64, macd: 0.60, volume: 0.48, attentionWeight: 0.09 },
  { step: 3, actual: 0.755, seq2seq: 0.753, attentionLstm: 0.750, baselineLstm: 0.746, rsi: 0.67, macd: 0.63, volume: 0.52, attentionWeight: 0.11 },
  { step: 4, actual: 0.760, seq2seq: 0.758, attentionLstm: 0.754, baselineLstm: 0.749, rsi: 0.69, macd: 0.65, volume: 0.55, attentionWeight: 0.12 },
  { step: 5, actual: 0.758, seq2seq: 0.761, attentionLstm: 0.756, baselineLstm: 0.751, rsi: 0.68, macd: 0.64, volume: 0.50, attentionWeight: 0.09 },
  { step: 6, actual: 0.765, seq2seq: 0.764, attentionLstm: 0.760, baselineLstm: 0.753, rsi: 0.71, macd: 0.67, volume: 0.58, attentionWeight: 0.14 },
  { step: 7, actual: 0.772, seq2seq: 0.770, attentionLstm: 0.765, baselineLstm: 0.756, rsi: 0.73, macd: 0.69, volume: 0.61, attentionWeight: 0.16 },
  { step: 8, actual: 0.780, seq2seq: 0.778, attentionLstm: 0.771, baselineLstm: 0.760, rsi: 0.76, macd: 0.72, volume: 0.67, attentionWeight: 0.21 },
  { step: 9, actual: 0.775, seq2seq: 0.776, attentionLstm: 0.773, baselineLstm: 0.762, rsi: 0.74, macd: 0.70, volume: 0.59, attentionWeight: 0.15 },
  { step: 10, actual: 0.768, seq2seq: 0.771, attentionLstm: 0.770, baselineLstm: 0.764, rsi: 0.70, macd: 0.67, volume: 0.53, attentionWeight: 0.10 },
  { step: 11, actual: 0.762, seq2seq: 0.765, attentionLstm: 0.766, baselineLstm: 0.765, rsi: 0.67, macd: 0.64, volume: 0.49, attentionWeight: 0.08 },
  { step: 12, actual: 0.759, seq2seq: 0.760, attentionLstm: 0.762, baselineLstm: 0.766, rsi: 0.65, macd: 0.62, volume: 0.46, attentionWeight: 0.07 },
  { step: 13, actual: 0.754, seq2seq: 0.755, attentionLstm: 0.758, baselineLstm: 0.767, rsi: 0.63, macd: 0.60, volume: 0.43, attentionWeight: 0.06 },
  { step: 14, actual: 0.750, seq2seq: 0.751, attentionLstm: 0.754, baselineLstm: 0.768, rsi: 0.61, macd: 0.58, volume: 0.41, attentionWeight: 0.05 },
  { step: 15, actual: 0.745, seq2seq: 0.747, attentionLstm: 0.750, baselineLstm: 0.768, rsi: 0.59, macd: 0.56, volume: 0.39, attentionWeight: 0.05 },
  { step: 16, actual: 0.741, seq2seq: 0.743, attentionLstm: 0.746, baselineLstm: 0.767, rsi: 0.57, macd: 0.54, volume: 0.37, attentionWeight: 0.04 },
  { step: 17, actual: 0.738, seq2seq: 0.740, attentionLstm: 0.742, baselineLstm: 0.766, rsi: 0.55, macd: 0.52, volume: 0.36, attentionWeight: 0.04 },
  { step: 18, actual: 0.735, seq2seq: 0.737, attentionLstm: 0.738, baselineLstm: 0.764, rsi: 0.53, macd: 0.50, volume: 0.35, attentionWeight: 0.03 },
  { step: 19, actual: 0.739, seq2seq: 0.736, attentionLstm: 0.735, baselineLstm: 0.762, rsi: 0.55, macd: 0.51, volume: 0.38, attentionWeight: 0.04 },
  { step: 20, actual: 0.744, seq2seq: 0.741, attentionLstm: 0.737, baselineLstm: 0.759, rsi: 0.58, macd: 0.53, volume: 0.42, attentionWeight: 0.05 },
  { step: 21, actual: 0.750, seq2seq: 0.747, attentionLstm: 0.741, baselineLstm: 0.756, rsi: 0.61, macd: 0.56, volume: 0.46, attentionWeight: 0.06 },
  { step: 22, actual: 0.756, seq2seq: 0.754, attentionLstm: 0.747, baselineLstm: 0.753, rsi: 0.64, macd: 0.59, volume: 0.50, attentionWeight: 0.07 },
  { step: 23, actual: 0.762, seq2seq: 0.760, attentionLstm: 0.752, baselineLstm: 0.750, rsi: 0.67, macd: 0.62, volume: 0.54, attentionWeight: 0.08 },
  { step: 24, actual: 0.768, seq2seq: 0.766, attentionLstm: 0.758, baselineLstm: 0.748, rsi: 0.70, macd: 0.65, volume: 0.57, attentionWeight: 0.09 },
];

export function BitcoinForecastVisualizer({ locale }: BitcoinForecastVisualizerProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType>("seq2seq");
  const [selectedStep, setSelectedStep] = useState<number>(8);
  const [showRsi, setShowRsi] = useState<boolean>(true);
  const [showMacd, setShowMacd] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const isEn = locale === "en";

  const currentPoint = FORECAST_SERIES[selectedStep - 1] || FORECAST_SERIES[0];

  // Dynamic calculations
  const stats = useMemo(() => {
    const predicted =
      selectedModel === "seq2seq"
        ? currentPoint.seq2seq
        : selectedModel === "attention_lstm"
        ? currentPoint.attentionLstm
        : currentPoint.baselineLstm;

    const error = Math.abs(currentPoint.actual - predicted);

    return {
      predicted,
      actual: currentPoint.actual,
      error,
      modelName:
        selectedModel === "seq2seq"
          ? "Seq2Seq + Attention"
          : selectedModel === "attention_lstm"
          ? "Attention-LSTM"
          : "Baseline LSTM",
      recordedMae:
        selectedModel === "seq2seq"
          ? "0.00418"
          : selectedModel === "attention_lstm"
          ? "0.00512"
          : "0.00684",
    };
  }, [selectedModel, currentPoint]);

  return (
    <section className="bitcoin-visualizer-container glass-panel" aria-label="Interactive Bitcoin Forecast Visualizer">
      <div className="inspector-head">
        <div className="inspector-badge">
          <span className="live-dot" />
          <span>{isEn ? "INTERACTIVE SEQ2SEQ SCRUBBER" : "SCRUBBER FORECASTING INTERAKTIF"}</span>
        </div>
        <div className="sequence-spec-tags">
          <span className="spec-tag">72-Step Input Window</span>
          <span className="spec-tag">24-Step Horizon</span>
          <span className="spec-tag">5 Multi-Variate Features</span>
        </div>
      </div>

      <div className="inspector-body">
        {/* Model Selector Bar */}
        <div className="model-tabs-bar">
          <span className="model-tabs-label">{isEn ? "Select Architecture:" : "Pilih Arsitektur:"}</span>
          <div className="model-tabs-group">
            <button
              type="button"
              className={`model-tab-btn ${selectedModel === "seq2seq" ? "active" : ""}`}
              onClick={() => setSelectedModel("seq2seq")}
            >
              <strong>Seq2Seq (Encoder-Decoder)</strong>
              <small>MAE 0.00418 (Best)</small>
            </button>
            <button
              type="button"
              className={`model-tab-btn ${selectedModel === "attention_lstm" ? "active" : ""}`}
              onClick={() => setSelectedModel("attention_lstm")}
            >
              <strong>Attention-Enhanced LSTM</strong>
              <small>MAE 0.00512</small>
            </button>
            <button
              type="button"
              className={`model-tab-btn ${selectedModel === "baseline_lstm" ? "active" : ""}`}
              onClick={() => setSelectedModel("baseline_lstm")}
            >
              <strong>Baseline LSTM</strong>
              <small>MAE 0.00684</small>
            </button>
          </div>
        </div>

        {/* Interactive Timeline Graph Canvas */}
        <div className="forecast-chart-card glass-panel">
          <div className="chart-header">
            <div>
              <span className="eyebrow">{isEn ? "Multi-Step Forecasting Horizon" : "Horizon Prediksi 24 Langkah"}</span>
              <h3>
                {isEn ? "Actual vs Predicted Scaled Price" : "Harga Aktual vs Prediksi (Normalisasi)"}
              </h3>
            </div>
            {/* Feature layer toggles */}
            <div className="feature-toggles">
              <button
                type="button"
                className={`toggle-chip ${showRsi ? "is-active" : ""}`}
                onClick={() => setShowRsi(!showRsi)}
              >
                RSI {showRsi ? "✓" : ""}
              </button>
              <button
                type="button"
                className={`toggle-chip ${showMacd ? "is-active" : ""}`}
                onClick={() => setShowMacd(!showMacd)}
              >
                MACD {showMacd ? "✓" : ""}
              </button>
              <button
                type="button"
                className={`toggle-chip ${showVolume ? "is-active" : ""}`}
                onClick={() => setShowVolume(!showVolume)}
              >
                Volume {showVolume ? "✓" : ""}
              </button>
            </div>
          </div>

          {/* Sequence Chart Bars Representation */}
          <div className="sequence-bars-wrapper">
            <div className="bars-track">
              {FORECAST_SERIES.map((pt) => {
                const isSelected = pt.step === selectedStep;
                const predVal =
                  selectedModel === "seq2seq"
                    ? pt.seq2seq
                    : selectedModel === "attention_lstm"
                    ? pt.attentionLstm
                    : pt.baselineLstm;

                const actualHeight = `${Math.round(pt.actual * 100)}%`;
                const predHeight = `${Math.round(predVal * 100)}%`;

                return (
                  <button
                    key={pt.step}
                    type="button"
                    className={`bar-column ${isSelected ? "is-focused" : ""}`}
                    onClick={() => setSelectedStep(pt.step)}
                    title={`Step +${pt.step}h | Actual: ${pt.actual.toFixed(3)} | Pred: ${predVal.toFixed(3)}`}
                    aria-label={
                      isEn
                        ? `Step +${pt.step} hours: Actual ${pt.actual.toFixed(3)}, Predicted ${predVal.toFixed(3)}`
                        : `Langkah +${pt.step} jam: Target ${pt.actual.toFixed(3)}, Prediksi ${predVal.toFixed(3)}`
                    }
                    aria-pressed={isSelected}
                  >
                    <div className="bar-pair">
                      {/* Actual Price Bar */}
                      <div className="bar-actual" style={{ height: actualHeight }} />
                      {/* Predicted Price Bar */}
                      <div className="bar-pred" style={{ height: predHeight }} />
                    </div>
                    {showRsi && (
                      <div className="dot-indicator dot-rsi" style={{ bottom: `${pt.rsi * 90}%` }} />
                    )}
                    {showMacd && (
                      <div className="dot-indicator dot-macd" style={{ bottom: `${pt.macd * 90}%` }} />
                    )}
                    <span className="step-label">+{pt.step}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-box color-actual" />
              <span>{isEn ? "Actual Target (Scaled)" : "Target Aktual (Ternormalisasi)"}</span>
            </div>
            <div className="legend-item">
              <span className="legend-box color-pred" />
              <span>{stats.modelName}</span>
            </div>
            {showRsi && (
              <div className="legend-item">
                <span className="legend-dot color-rsi" />
                <span>RSI 14</span>
              </div>
            )}
            {showMacd && (
              <div className="legend-item">
                <span className="legend-dot color-macd" />
                <span>MACD Hist</span>
              </div>
            )}
          </div>
        </div>

        {/* Step Scrubber & Real-Time Inspection */}
        <div className="scrubber-card glass-panel">
          <div className="scrubber-header">
            <label htmlFor="forecast-step-slider" className="scrubber-label">
              <strong>{isEn ? "Forecast Horizon Scrubber:" : "Geser Horizon Waktu:"}</strong>
              <span className="current-step-badge">+{selectedStep} Hours Ahead (t + {selectedStep})</span>
            </label>
          </div>
          <input
            id="forecast-step-slider"
            type="range"
            min={1}
            max={24}
            value={selectedStep}
            onChange={(e) => setSelectedStep(Number(e.target.value))}
            className="horizon-slider"
            aria-label={isEn ? "Forecast Horizon Scrubber (1 to 24 hours ahead)" : "Scrubber Horizon Prediksi (1 hingga 24 jam ke depan)"}
            aria-valuemin={1}
            aria-valuemax={24}
            aria-valuenow={selectedStep}
            aria-valuetext={
              isEn
                ? `+${selectedStep} hours: Target ${stats.actual.toFixed(4)}, Prediction ${stats.predicted.toFixed(4)} by ${stats.modelName}`
                : `+${selectedStep} jam: Target ${stats.actual.toFixed(4)}, Prediksi ${stats.predicted.toFixed(4)} oleh ${stats.modelName}`
            }
          />

          {/* Instant Point Stats */}
          <div className="point-stats-grid">
            <div className="pstat-box glass-panel">
              <span className="pstat-title">{isEn ? "Target Value" : "Nilai Aktual"}</span>
              <strong className="text-actual">{stats.actual.toFixed(4)}</strong>
              <small>{isEn ? "MinMax Scaled" : "Skala MinMax"}</small>
            </div>
            <div className="pstat-box glass-panel">
              <span className="pstat-title">{isEn ? "Model Prediction" : "Prediksi Model"}</span>
              <strong className="text-pred">{stats.predicted.toFixed(4)}</strong>
              <small>{stats.modelName}</small>
            </div>
            <div className="pstat-box glass-panel">
              <span className="pstat-title">{isEn ? "Absolute Error (|y - ŷ|)" : "Absolute Error (|y - ŷ|)"}</span>
              <strong className="text-err">{stats.error.toFixed(5)}</strong>
              <small>{isEn ? "Step Error" : "Deviasi Langkah"}</small>
            </div>
            <div className="pstat-box glass-panel">
              <span className="pstat-title">{isEn ? "Test Set MAE" : "MAE Keseluruhan"}</span>
              <strong className="text-highlight">{stats.recordedMae}</strong>
              <small>{isEn ? "Recorded Evaluation" : "Hasil Evaluasi Catatan"}</small>
            </div>
          </div>

          {/* Screen reader polite status for step updates (no excessive mouse move noise) */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {isEn
              ? `Selected Step +${selectedStep} hours. Model ${stats.modelName}. Target: ${stats.actual.toFixed(4)}, Prediction: ${stats.predicted.toFixed(4)}, Absolute Error: ${stats.error.toFixed(5)}.`
              : `Langkah terpilih +${selectedStep} jam. Model ${stats.modelName}. Target: ${stats.actual.toFixed(4)}, Prediksi: ${stats.predicted.toFixed(4)}, Selisih Error: ${stats.error.toFixed(5)}.`}
          </div>

          {/* Accessible Fallback Tabular Summary */}
          <details className="accessible-data-summary">
            <summary className="accessible-summary-toggle">
              {isEn
                ? "📊 View Accessible 24-Step Horizon Data Table"
                : "📊 Lihat Tabel Data Horizon 24-Langkah (Aksesibel)"}
            </summary>
            <div className="accessible-table-wrapper">
              <table className="accessible-forecast-table">
                <caption className="sr-only">
                  {isEn
                    ? "24-Step Bitcoin Forecasting Evaluation Data across Seq2Seq, Attention-LSTM, and Baseline LSTM architectures"
                    : "Data Evaluasi Forecasting Bitcoin 24 Langkah pada arsitektur Seq2Seq, Attention-LSTM, dan Baseline LSTM"}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Step</th>
                    <th scope="col">Actual</th>
                    <th scope="col">Seq2Seq</th>
                    <th scope="col">Attn-LSTM</th>
                    <th scope="col">Base-LSTM</th>
                    <th scope="col">RSI</th>
                    <th scope="col">MACD</th>
                  </tr>
                </thead>
                <tbody>
                  {FORECAST_SERIES.map((pt) => {
                    const isRowActive = pt.step === selectedStep;
                    return (
                      <tr key={pt.step} className={isRowActive ? "is-selected-row" : ""}>
                        <td>+{pt.step}h</td>
                        <td>{pt.actual.toFixed(3)}</td>
                        <td>{pt.seq2seq.toFixed(3)}</td>
                        <td>{pt.attentionLstm.toFixed(3)}</td>
                        <td>{pt.baselineLstm.toFixed(3)}</td>
                        <td>{pt.rsi.toFixed(2)}</td>
                        <td>{pt.macd.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        </div>

        {/* Safe Claims Note */}
        <div className="sentiment-safe-footer">
          <span className="safe-icon">ℹ</span>
          <p>
            {isEn
              ? "Verified against notebook source: The test MAE (0.00418) is recorded on the scaled [0, 1] target from a chronological 70/20/10 split. It does not represent dollar values, trading profits, or future market guarantees."
              : "Diverifikasi terhadap source notebook: Test MAE (0.00418) dihitung pada target terskala [0, 1] dari pembagian kronologis 70/20/10. Nilai ini bukan angka dolar dan bukan jaminan profit trading."}
          </p>
        </div>
      </div>
    </section>
  );
}
