import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  Copy,
  HeartHandshake,
  LockKeyhole,
  Network,
  Share2,
  WalletCards,
} from "lucide-react";

const BTC_ADDRESS = "bc1qcrxns03rwfyr7kfqh0l0g3ha0sfyc4mjq73vrf";
const XMR_ADDRESS =
  "3RByWWMPMu9jpMtqh4ZMRhvYHpdwymch6P6mxiUX5mfcsU2Jsu9ppRUnUepzh75Ap1tKTYSFxKhTZaxofec9YXnAYqvx5N";
const ETH_ADDRESS = "0x332D2444bF2bb113Eae5C6DFb15Cc7a3E8D8fB8b";

export default function Support() {
  const [copied, setCopied] = useState("");

  const copyAddress = async (address: string, asset: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(asset);

      window.setTimeout(() => {
        setCopied((current) => (current === asset ? "" : current));
      }, 1800);
    } catch {
      setCopied("");
    }
  };

  const wallets = [
    { asset: "BTC", name: "BITCOIN", address: BTC_ADDRESS },
    { asset: "XMR", name: "MONERO", address: XMR_ADDRESS },
    { asset: "ETH", name: "ETHEREUM", address: ETH_ADDRESS },
  ];

  return (
    <div className="page page-support">
      <section className="page-intro">
        <div>
          <p className="eyebrow">
            KEEP THE DOJO OPEN / <span>04</span>
          </p>
          <h1>
            SUPPORT
            <br />
            <span>SLEEPER-Z.</span>
          </h1>
        </div>
      </section>

      <section
        className="support-footnote"
        style={{
          marginTop: "12px",
          marginBottom: "40px",
          padding: "clamp(28px, 6vw, 64px)",
          border: "1px solid #38bdf8",
          borderRadius: "16px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(10,15,30,0.96))",
          boxShadow: "0 0 32px rgba(56,189,248,0.14)",
        }}
      >
        <Share2
          size={38}
          style={{ margin: "0 auto 18px", color: "#38bdf8" }}
        />

        <p
          className="eyebrow"
          style={{
            marginBottom: "14px",
            color: "#38bdf8",
            letterSpacing: "0.2em",
          }}
        >
          HELP THE DOJO GROW
        </p>

        <h2
          style={{
            margin: "0 auto 18px",
            fontSize: "clamp(30px, 6vw, 58px)",
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            overflowWrap: "anywhere",
          }}
        >
          THE BEST SUPPORT IS
          <br />
          <span style={{ color: "#38bdf8" }}>SHARING SLEEPER-Z.</span>
        </h2>

        <p
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            fontSize: "clamp(15px, 2vw, 19px)",
            lineHeight: 1.7,
            opacity: 0.9,
          }}
        >
          Tell a friend. Share the website. Bring more people into the dojo.
        </p>
      </section>

      <div className="support-layout">
        <section className="support-main">
          <div className="support-hero">
            <div className="support-hero__symbol">
              <CircleDollarSign size={28} />
            </div>

            <div>
              <p className="eyebrow">OPTIONAL / NO PRESSURE</p>
              <h2>
                FUND THE
                <br />
                <span>NEXT ROUND.</span>
              </h2>

              <p>
                There is no purchase required to use Sleeper-Z. If the dojo
                helps you sharpen your recall, you may choose to support the
                work with a voluntary cryptocurrency donation.
              </p>
            </div>
          </div>

          <div className="funding-grid">
            <div>
              <span className="funding-number">01</span>
              <HeartHandshake size={18} />
              <h3>HOSTING + MAINTENANCE</h3>
              <p>
                Keep the quiz experience available and the underlying systems
                cared for.
              </p>
            </div>

            <div>
              <span className="funding-number">02</span>
              <Code2 size={18} />
              <h3>NEW ORIGINAL QUIZZES</h3>
              <p>
                Expand the question library without borrowing unauthorized
                media or branding.
              </p>
            </div>

            <div>
              <span className="funding-number">03</span>
              <Network size={18} />
              <h3>FUTURE IMPROVEMENTS</h3>
              <p>
                Support accessibility, performance, and future features.
              </p>
            </div>
          </div>
        </section>

        <aside className="support-side">
          <div className="wallet-card">
            <div className="wallet-card__head">
              <span className="eyebrow">DONATION ADDRESSES</span>
              <span className="status-badge status-badge--active">
                <span /> 3 ADDRESSES
              </span>
            </div>

            {wallets.map((wallet) => (
              <div
                className="wallet-placeholder wallet-placeholder--active"
                key={wallet.asset}
              >
                <WalletCards size={22} />

                <span className="wallet-network">{wallet.name}</span>

                <strong className="wallet-address">{wallet.address}</strong>

                <button
                  type="button"
                  className="text-button wallet-copy"
                  onClick={() => copyAddress(wallet.address, wallet.asset)}
                >
                  {copied === wallet.asset ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Copy size={14} />
                  )}

                  {copied === wallet.asset
                    ? "COPIED"
                    : `COPY ${wallet.asset} ADDRESS`}
                </button>

                <small>
                  Verify the address and compatible network in your own wallet
                  before sending. Blockchain transfers generally cannot be
                  reversed.
                </small>
              </div>
            ))}

            <button
              type="button"
              className="button button-muted"
              disabled
            >
              DONATION ADDRESSES CONFIGURED <LockKeyhole size={15} />
            </button>
          </div>

          <div className="config-card">
            <div className="config-card__head">
              <AlertTriangle size={17} />
              <h3>CONFIGURATION REQUIRED</h3>
            </div>

            <p>
              Before accepting donations as an official program, the project
              owner should verify:
            </p>

            <ul>
              <li>
                <CheckCircle2 size={14} /> Wallet ownership and custody
              </li>
              <li>
                <CheckCircle2 size={14} /> Donation accounting and
                reconciliation
              </li>
              <li>
                <CheckCircle2 size={14} /> Legal, tax, and privacy copy
              </li>
              <li>
                <CheckCircle2 size={14} /> Public donation policy
              </li>
            </ul>

            <p className="config-note">
              No payment processor, transaction, donor count, or user statistic
              is claimed here.
            </p>
          </div>

          <div className="config-card config-card--asset">
            <div className="config-card__head">
              <AlertTriangle size={17} />
              <h3>ASSET STATUS</h3>
            </div>

            <p>
              Jordan Watkins Text Animations are integrated. No Grudge Overlay
              files were included in the supplied archive, so overlay moments
              are not faked with substitutes.
            </p>

            <p className="config-note">
              Provide the original overlay files and intended timing/placement
              before enabling those transitions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}