import React from "react";

const FAQs = () => {
  return (
    <section
      id="faq"
      className="wow animate__animated animate__fadeInUp animate__duration-1s faq"
    >
      <div className="container" data-aos="fade-up">
        <header className="section-header">
          <h2 className="main-text">F.A.Qs</h2>
          <p className="sub-text">Frequently Asked Questions</p>
        </header>

        <div className="row">
          <div className="col-lg-6">
            {/* F.A.Q List 1*/}
            <div className="accordion accordion-flush" id="faqlist1">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-content-1"
                    aria-expanded="false"
                    aria-controls="faq-content-1"
                  >
                    What is EthTix?
                  </button>
                </h2>
                <div
                  id="faq-content-1"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist1"
                >
                  <div className="accordion-body">
                    EthTix is a decentralized event management system built on
                    blockchain technology, allowing event organizers to create
                    events, users to buy tickets, and administrators to oversee
                    the platform's operations.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-content-2"
                    aria-expanded="false"
                    aria-controls="faq-content-2"
                  >
                    How does EthTix work?
                  </button>
                </h2>
                <div
                  id="faq-content-2"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist1"
                >
                  <div className="accordion-body">
                    EthTix utilizes smart contracts on the Ethereum blockchain
                    to facilitate the creation of events, purchase of tickets,
                    and management of event-related activities in a transparent
                    and decentralized manner.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-content-3"
                    aria-expanded="false"
                    aria-controls="faq-content-3"
                  >
                    Why should I use EthTix?
                  </button>
                </h2>
                <div
                  id="faq-content-3"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist1"
                >
                  <div className="accordion-body">
                    EthTix as a fully decentralized platform offers
                    transparency, security, and immutability through blockchain
                    technology, ensuring that event transactions are secure and
                    tamper-proof. Additionally, it eliminates the need for
                    intermediaries, reducing costs and increasing efficiency.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-content-4"
                    aria-expanded="false"
                    aria-controls="faq-content-4"
                  >
                    How do I buy tickets for an event on EthTix?
                  </button>
                </h2>
                <div
                  id="faq-content-4"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist1"
                >
                  <div className="accordion-body">
                    Users can buy tickets for events listed on EthTix by
                    accessing the platform, browsing available events, selecting
                    desired tickets, and completing the purchase using ethereum
                    cryptocurrency.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            {/*F.A.Q List 2 */}
            <div className="accordion accordion-flush" id="faqlist2">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2-content-1"
                    aria-expanded="false"
                    aria-controls="faq2-content-1"
                  >
                    How do I create an event on EthTix?
                  </button>
                </h2>
                <div
                  id="faq2-content-1"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist2"
                >
                  <div className="accordion-body">
                    Event organizers can create events on EthTix by accessing
                    the platform, providing necessary event details and setting
                    ticket prices to manage ticket sales and event logistics.
                    Users needs to register as an event organizer to create
                    events.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2-content-2"
                    aria-expanded="false"
                    aria-controls="faq-content-2"
                  >
                    Can I trust EthTix with my personal and payment information?
                  </button>
                </h2>
                <div
                  id="faq2-content-2"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist2"
                >
                  <div className="accordion-body">
                    EthTix leverages blockchain technology to secure user data
                    and transactions, providing a high level of trust and
                    security. However, users should always exercise caution and
                    follow best practices for online security.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2-content-3"
                    aria-expanded="false"
                    aria-controls="faq-content-3"
                  >
                    What cryptocurrencies are accepted for purchasing tickets on
                    EthTix?
                  </button>
                </h2>
                <div
                  id="faq2-content-3"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist2"
                >
                  <div className="accordion-body">
                    EthTix currently accepts Ether (ETH) for purchasing tickets.
                    Additional cryptocurrencies may be supported in the future,
                    depending on platform developments and user demand
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#faq2-content-4"
                    aria-expanded="false"
                    aria-controls="faq-content-4"
                  >
                    Is there customer support available for EthTix users?
                  </button>
                </h2>
                <div
                  id="faq2-content-4"
                  className="accordion-collapse collapse"
                  data-bs-parent="#faqlist2"
                >
                  <div className="accordion-body">
                    EthTix does not have official customer support channels such
                    as email or phone. However, users can directly reach out to
                    the developers for assistance with any inquiries, technical
                    issues, or concerns related to the platform and its
                    services. Developers are committed to providing support and
                    addressing user needs promptly.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
