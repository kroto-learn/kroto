import Layout from "@/components/layouts/main";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="mx-auto my-20 w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12">
        <div className="flex flex-grow flex-col gap-3">
          <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
            <div className="prose prose-invert w-full break-words">
              <h1>Privacy Policy for Kroto</h1>
              <p>
                {`Kroto Creator Labs ("us", "we", or "our") operates the kroto.in
              website (the "Service").`}
              </p>
              <p>
                This page informs you of our policies regarding the collection,
                use, and disclosure of personal data when you use our Service
                and the choices you have associated with that data.
              </p>
              <p>
                We use your data to provide and improve the Service. By using
                the Service, you agree to the collection and use of information
                in accordance with this policy.
              </p>
              <h2>Information Collection and Use</h2>
              <p>
                We collect several different types of information for various
                purposes to provide and improve our Service to you.
              </p>
              <h3>Types of Data Collected</h3>
              <h4>Personal Data</h4>
              <p>
                {`While using our Service, we may ask you to provide us with certain
              personally identifiable information that can be used to contact or
              identify you ("Personal Data"). Personally identifiable
              information may include, but is not limited to:`}
              </p>
              <ul>
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
              </ul>
              <h4>Usage Data</h4>
              <p>
                {`We may also collect information how the Service is accessed and
              used ("Usage Data"). This Usage Data may include information such
              as your computer's Internet Protocol address (e.g. IP address),
              browser type, browser version, the pages of our Service that you
              visit, the time and date of your visit, the time spent on those
              pages, unique device identifiers and other diagnostic data.`}
              </p>
              <h4>Tracking &amp; Cookies Data</h4>
              <p>
                We use cookies and similar tracking technologies to track the
                activity on our Service and hold certain information.
              </p>
              <p>Examples of Cookies we use:</p>
              <ul>
                <li>
                  Session Cookies. We use Session Cookies to operate our
                  Service.
                </li>
                <li>
                  Preference Cookies. We use Preference Cookies to remember your
                  preferences and various settings.
                </li>
                <li>
                  Security Cookies. We use Security Cookies for security
                  purposes.
                </li>
              </ul>
              <h3>Use of Data</h3>
              <p>We use the collected data for various purposes:</p>
              <ul>
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>
                  To allow you to participate in interactive features of our
                  Service when you choose to do so
                </li>
                <li>To provide customer care and support</li>
                <li>
                  To provide analysis or valuable information so that we can
                  improve the Service
                </li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
              <h3>Transfer of Data</h3>
              <p>
                Your information, including Personal Data, may be transferred to
                - and maintained on - computers located outside of your state,
                province, country or other governmental jurisdiction where the
                data protection laws may differ from those of your jurisdiction.
              </p>
              <p>
                If you are located outside India and choose to provide
                information to us, please note that we transfer the data,
                including Personal Data, to India and process it there.
              </p>
              <p>
                Your consent to this Privacy Policy followed by your submission
                of such information represents your agreement to that transfer.
              </p>
              <h3>Disclosure of Data</h3>
              <p>
                We may disclose personal information that we collect, or you
                provide:
              </p>
              <ul>
                <li>
                  To comply with any court order, law, or legal process,
                  including to respond to any government or regulatory request.
                </li>
                <li>
                  To enforce or apply our terms of use or terms of service and
                  other agreements, including for billing and collection
                  purposes.
                </li>
                <li>
                  If we believe disclosure is necessary or appropriate to
                  protect the rights, property, or safety of [Your Startup
                  Name], our customers, or others.
                </li>
              </ul>
              <h3>Security of Data</h3>
              <p>
                The security of your data is important to us but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Data, we
                cannot guarantee its absolute security.
              </p>
              <h3>Service Providers</h3>
              <p>
                {` We may employ third party companies and individuals to facilitate
              our Service ("Service Providers"), to provide the Service on our
              behalf, to perform Service-related services or to assist us in
              analyzing how our Service is used.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
