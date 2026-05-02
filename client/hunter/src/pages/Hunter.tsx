import { useNavigate } from "react-router-dom";

export function Hunter() {
   const navigate = useNavigate();

  return (
        <div className="artboard">
            <div className="landing-gradient">
                
                <nav className="flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md sticky top-0 border-b border-white/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
 
                                <rect width="64" height="64" rx="16" fill="#111827"/>

                                
                                <rect x="16" y="26" width="32" height="20" rx="4" stroke="#60A5FA" stroke-width="2"/>
                                <path d="M24 26V22C24 20.8954 24.8954 20 26 20H38C39.1046 20 40 20.8954 40 22V26" stroke="#60A5FA" stroke-width="2"/>

                                
                                <path d="M26 38L32 32L38 38" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M32 32V44" stroke="#34D399" stroke-width="2" stroke-linecap="round"/>


                                <circle cx="48" cy="16" r="3" fill="#FBBF24"/>
                            </svg>
                        </div>
                        <span className="font-bold text-lg">Hunter </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Testimonials</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={()=> {navigate('/login')}} className="text-slate-600 font-medium text-sm hover:text-indigo-600 transition-colors px-4 py-2">Sign In</button>
                        <button onClick={()=> {navigate('/signup')}} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Get Started</button>
                    </div>
                </nav>

                
                <div className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-100/40 to-transparent rounded-l-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="px-8 py-16 text-center max-w-5xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm text-sm font-medium text-slate-600 mb-6">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                            </span>
                            Now with AI-Powered Cover Letters
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                            Land Your <span className="text-indigo-600">Dream Job</span>
                            3x Faster with AI
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                            Stop juggling spreadsheets. Track applications, generate personalized cover letters, and get data-driven insights to optimize your job search.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <button onClick={()=> {navigate('/login')}} className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2">
                                Start Tracking for Free
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                Watch Demo
                            </button>
                        </div>

                        
                        <div className="relative max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                                <div className="h-8 bg-slate-100 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    <div className="ml-4 w-64 h-5 bg-white rounded-md border border-slate-200"></div>
                                </div>
                                <div className="p-6 grid grid-cols-12 gap-4">
                                    <div className="col-span-3 space-y-3">
                                        <div className="h-8 bg-indigo-100 rounded-lg w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                    <div className="col-span-9 grid grid-cols-3 gap-3">
                                        <div className="bg-indigo-50 rounded-xl p-4 h-24"></div>
                                        <div className="bg-emerald-50 rounded-xl p-4 h-24"></div>
                                        <div className="bg-purple-50 rounded-xl p-4 h-24"></div>
                                        <div className="bg-white border border-slate-100 shadow-sm rounded-xl col-span-2 h-48 p-4">
                                            <div className="h-full flex items-end gap-3 pb-2">
                                                <div className="w-full bg-indigo-200 rounded-t-lg h-[40%]"></div>
                                                <div className="w-full bg-indigo-300 rounded-t-lg h-[60%]"></div>
                                                <div className="w-full bg-indigo-400 rounded-t-lg h-[45%]"></div>
                                                <div className="w-full bg-indigo-500 rounded-t-lg h-[80%]"></div>
                                                <div className="w-full bg-indigo-600 rounded-t-lg h-[70%]"></div>
                                            </div>
                                        </div>
                                        <div className="bg-white border border-slate-100 shadow-sm rounded-xl h-48 p-4 flex items-center justify-center">
                                            <div className="w-24 h-24 rounded-full border-8 border-emerald-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">✓</div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800">Offer Received!</div>
                                    <div className="text-xs text-slate-500">Frontend Dev at Stripe</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="px-8 py-20 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need</h2>
                            <p className="text-slate-500 max-w-xl mx-auto">Powerful features designed to streamline every stage of your job search.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="feature-card bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">AI Cover Letters</h3>
                                <p className="text-slate-500 leading-relaxed">Generate tailored cover letters in seconds. Our AI matches your resume to the job description perfectly.</p>
                            </div>
                            <div className="feature-card bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Kanban Tracking</h3>
                                <p className="text-slate-500 leading-relaxed">Visualize your pipeline with drag-and-drop boards. Never lose track of an application again.</p>
                            </div>
                            <div className="feature-card bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                                </div>
                                <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
                                <p className="text-slate-500 leading-relaxed">Data-driven insights to optimize your search strategy. Track response rates and interview conversion.</p>
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="px-8 py-20 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                            <p className="text-slate-500">Get started in three simple steps.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 relative">
                            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                            <div className="text-center relative z-10">
                                <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">1</div>
                                <h3 className="text-xl font-bold mb-2">Add Jobs</h3>
                                <p className="text-slate-500 px-4">Quickly add roles via browser extension or manual entry. Auto-fill company details.</p>
                            </div>
                            <div className="text-center relative z-10">
                                <div className="w-16 h-16 bg-white border-2 border-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-indigo-600 text-2xl font-bold shadow-sm">2</div>
                                <h3 className="text-xl font-bold mb-2">Track & AI</h3>
                                <p className="text-slate-500 px-4">Move cards through stages. Use AI to generate documents and set reminders.</p>
                            </div>
                            <div className="text-center relative z-10">
                                <div className="w-16 h-16 bg-white border-2 border-slate-300 rounded-2xl mx-auto mb-6 flex items-center justify-center text-slate-500 text-2xl font-bold shadow-sm">3</div>
                                <h3 className="text-xl font-bold mb-2">Get Hired</h3>
                                <p className="text-slate-500 px-4">Analyze what works, follow up on time, and land the offer. It's that simple.</p>
                            </div>
                        </div>
                    </div>
                </div>

                
                {/* <div className="px-8 py-20 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Loved by Job Seekers</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex gap-1 mb-4">
                                    <span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span>
                                </div>
                                <p className="text-slate-600 mb-6">"The Kanban view is a game changer. I finally feel organized in my chaotic job search."</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-200 rounded-full"></div>
                                    <div>
                                        <div className="font-semibold text-sm">Sarah Chen</div>
                                        <div className="text-xs text-slate-500">Hired at Google</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex gap-1 mb-4">
                                    <span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span>
                                </div>
                                <p className="text-slate-600 mb-6">"AI cover letters saved me hours. Highly recommend for anyone applying to many roles."</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-200 rounded-full"></div>
                                    <div>
                                        <div className="font-semibold text-sm">Marcus Johnson</div>
                                        <div className="text-xs text-slate-500">Hired at Stripe</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex gap-1 mb-4">
                                    <span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span><span className="text-amber-400">★</span>
                                </div>
                                <p className="text-slate-600 mb-6">"Analytics showed me which days to apply for best response rates. Landed 3 offers!"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-200 rounded-full"></div>
                                    <div>
                                        <div className="font-semibold text-sm">Priya Patel</div>
                                        <div className="text-xs text-slate-500">Hired at Meta</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="px-8 py-24 bg-indigo-600 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Search?</h2>
                        <p className="text-indigo-100 text-lg mb-8">Join 50,000+ job seekers landing offers faster.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl text-slate-900 outline-none bg-white focus:ring-2 focus:ring-white/50" />
                            <button onClick={()=> {navigate('/signup')}} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">Get Started</button>
                        </div>
                        <p className="text-xs text-indigo-200 mt-4">No credit card required. Free plan available.</p>
                    </div>
                </div>

                
                <footer className="bg-slate-900 text-slate-400 py-12 px-8">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            </div>
                            <span className="text-white font-bold">Hunter</span>
                        </div>
                        <div className="flex gap-8 text-sm">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                            <a href="https://github.com/Shivam000189/hunter" className="hover:text-white">Support</a>
                            <a href="https://x.com/shivam_s0" className="hover:text-white">Twitter</a>
                        </div>
                        <div className="text-sm">© 2026 Hunter</div>
                    </div>
                </footer>
            </div>
        </div>
  );
}