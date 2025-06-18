import Image from "next/image";

export default function Home() {
  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-indigo-600 w-8 h-8 rounded-md mr-3"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Brand</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#faq" className="text-gray-600 hover:text-indigo-600 transition-colors">FAQ</a>
          </div>
          <button className="mt-4 sm:mt-0 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
            Sign In
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm mb-4">New Feature Released!</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-3xl mb-6 text-gray-800">
            Transform Your Workflow with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Smart Solutions</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mb-10">
            Streamline your processes with our intuitive platform designed for teams of all sizes. Save time, reduce errors, and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
              Get Started Free
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-indigo-400 bg-white text-gray-700 hover:text-indigo-700 transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Demo
            </button>
          </div>
          <div className="mt-16 w-full max-w-5xl">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-2 shadow-lg">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                Dashboard Preview
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 mb-10">Trusted by innovative teams at</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F'].map((company, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-center h-16 opacity-80 hover:opacity-100 transition-opacity">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Powerful Features</h2>
              <p className="text-gray-600">Everything you need to streamline your workflow and boost productivity</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Automated Workflows', description: 'Create custom workflows that automate repetitive tasks and save you hours each week.' },
                { title: 'Real-time Collaboration', description: 'Work together with your team in real-time with seamless collaboration features.' },
                { title: 'Advanced Analytics', description: 'Gain valuable insights with our powerful analytics dashboard and reporting tools.' },
                { title: 'Secure Data Storage', description: 'Enterprise-grade security keeps your data safe with encryption and backups.' },
                { title: 'Custom Integrations', description: 'Connect with your favorite tools using our extensive integration library.' },
                { title: 'Mobile Accessibility', description: 'Access all features from anywhere with our fully responsive mobile app.' },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md group">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                    <div className="bg-indigo-600 w-6 h-6 rounded-md"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Trusted by Thousands</h2>
              <p className="text-gray-600">Hear from our satisfied customers around the world</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { name: 'Alex Johnson', role: 'Product Manager, TechCorp', quote: 'This platform has completely transformed how our team collaborates. We\'ve seen a 40% increase in productivity since implementation.' },
                { name: 'Sarah Williams', role: 'CTO, InnovateCo', quote: 'The automation features alone have saved us hundreds of hours. The ROI has been incredible for our business.' },
                { name: 'Michael Chen', role: 'Operations Director, Global Solutions', quote: 'The analytics dashboard provides insights we never had before. It\'s become an essential tool for our decision-making.' },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
              <p className="text-gray-600">Choose the plan that works best for your team</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { 
                  name: 'Starter', 
                  price: '$19', 
                  period: '/month', 
                  description: 'Perfect for small teams getting started',
                  features: ['Up to 5 users', 'Basic features', '1 GB storage', 'Email support'],
                  highlight: false
                },
                { 
                  name: 'Professional', 
                  price: '$49', 
                  period: '/month', 
                  description: 'For growing teams with more needs',
                  features: ['Up to 20 users', 'Advanced features', '10 GB storage', 'Priority support', 'Custom integrations'],
                  highlight: true
                },
                { 
                  name: 'Enterprise', 
                  price: 'Custom', 
                  period: '', 
                  description: 'For large organizations with complex needs',
                  features: ['Unlimited users', 'All features', 'Unlimited storage', '24/7 dedicated support', 'Custom development'],
                  highlight: false
                }
              ].map((plan, index) => (
                <div key={index} className={`relative rounded-xl border ${plan.highlight ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'} p-8 bg-white shadow-sm`}>
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-medium ${plan.highlight ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' : 'border border-gray-300 text-gray-800 hover:border-indigo-400'}`}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Everything you need to know about the platform</p>
            </div>
            <div className="space-y-6">
              {[
                { 
                  question: 'How secure is my data?', 
                  answer: 'We take security very seriously. All data is encrypted at rest and in transit, and we undergo regular security audits to ensure your information is protected.' 
                },
                { 
                  question: 'Can I cancel my subscription anytime?', 
                  answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.' 
                },
                { 
                  question: 'Do you offer discounts for non-profits?', 
                  answer: 'Absolutely! We offer special pricing for non-profit organizations. Contact our sales team to learn more.' 
                },
                { 
                  question: 'How long does implementation take?', 
                  answer: 'Most teams are up and running within 24 hours. For enterprise customers with custom needs, implementation typically takes 1-2 weeks.' 
                },
                { 
                  question: 'What integrations do you support?', 
                  answer: 'We support over 50 integrations with popular tools like Slack, Google Workspace, Microsoft Teams, Salesforce, and more.' 
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-10">
              Join thousands of satisfied customers and experience the difference today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-all shadow-md">
                Create Free Account
              </button>
              <button className="px-8 py-3 border border-white rounded-lg text-white font-medium hover:bg-indigo-700 transition-all">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 w-8 h-8 rounded-md mr-3"></div>
                <span className="text-xl font-bold text-white">Brand</span>
              </div>
              <p className="text-gray-400 mb-4">
                Solving complex problems with simple solutions for teams worldwide.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'linkedin', 'github'].map((platform, index) => (
                  <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <div className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center">
                      {platform.charAt(0).toUpperCase()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
