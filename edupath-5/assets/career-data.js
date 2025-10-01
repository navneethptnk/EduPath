// Comprehensive Career Database
const careerData = {
  MPC: {
    name: "Mathematics, Physics, Chemistry",
    categories: [
      {
        id: "engineering",
        name: "Engineering",
        icon: "⚙️",
        description: "Design, build, and maintain systems and structures",
        specializations: [
          {
            id: "computer-engineering",
            name: "Computer Engineering",
            icon: "💻",
            description: "Design and develop computer systems and software",
            salaryRange: "₹4-15 LPA",
            growth: "15",
            skills: ["Programming", "System Design", "Problem Solving", "Mathematics", "Algorithms"],
            workEnvironment: "Office-based with flexible hours, often remote work options",
            responsibilities: [
              "Design and develop software applications",
              "Maintain and update existing systems",
              "Collaborate with cross-functional teams",
              "Troubleshoot technical issues",
              "Research new technologies"
            ],
            prospects: "Excellent growth potential with high demand across all industries",
            recommendedCourses: [
              {
                name: "B.Tech Computer Science",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Core computer science engineering program covering programming, algorithms, and system design",
                stream: "Science/Math",
                careerRelevance: "Essential foundation for computer engineering career"
              },
              {
                name: "M.Tech Computer Science",
                level: "Master's Degree", 
                duration: "2 years",
                description: "Advanced computer science with specialization in software engineering and research",
                stream: "Science/Math",
                careerRelevance: "Required for senior positions and technical leadership roles"
              },
              {
                name: "Diploma in Computer Applications",
                level: "Diploma",
                duration: "1 year",
                description: "Practical computer programming and software development skills",
                stream: "Science",
                careerRelevance: "Quick entry into software development field"
              }
            ],
            educationPaths: [
              {
                level: "Bachelor's Degree",
                duration: "4 years",
                eligibility: "12th with MPC, JEE Main/Advanced",
                subjects: ["Computer Science", "Mathematics", "Physics", "Programming"],
                outcomes: ["Software Engineer", "System Analyst", "Database Administrator"]
              },
              {
                level: "Master's Degree",
                duration: "2 years",
                eligibility: "B.Tech in Computer Science",
                subjects: ["Advanced Algorithms", "Machine Learning", "Data Structures", "Software Engineering"],
                outcomes: ["Senior Software Engineer", "Tech Lead", "Software Architect"]
              },
              {
                level: "PhD",
                duration: "3-5 years",
                eligibility: "M.Tech in Computer Science",
                subjects: ["Research Methods", "Advanced Topics", "Thesis Work"],
                outcomes: ["Research Scientist", "Professor", "Chief Technology Officer"]
              }
            ]
          },
          {
            id: "mechanical-engineering",
            name: "Mechanical Engineering",
            icon: "🔧",
            description: "Design, analyze, and manufacture mechanical systems",
            salaryRange: "₹3-12 LPA",
            growth: "12",
            skills: ["CAD Design", "Thermodynamics", "Materials Science", "Manufacturing", "Project Management"],
            workEnvironment: "Mix of office and workshop environments",
            responsibilities: [
              "Design mechanical systems and components",
              "Conduct feasibility studies",
              "Oversee manufacturing processes",
              "Ensure quality control",
              "Maintain equipment"
            ],
            prospects: "Steady growth in manufacturing, automotive, and aerospace industries",
            recommendedCourses: [
              {
                name: "B.Tech Mechanical Engineering",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Comprehensive mechanical engineering covering design, manufacturing, and analysis",
                stream: "Science/Math",
                careerRelevance: "Core qualification for mechanical engineering roles"
              },
              {
                name: "M.Tech Mechanical Engineering",
                level: "Master's Degree",
                duration: "2 years", 
                description: "Advanced mechanical engineering with specialization in design and manufacturing",
                stream: "Science/Math",
                careerRelevance: "Required for senior engineering and research positions"
              },
              {
                name: "Diploma in Engineering",
                level: "Diploma",
                duration: "3 years",
                description: "Technical engineering skills for manufacturing and maintenance roles",
                stream: "Science",
                careerRelevance: "Entry-level technical positions in manufacturing"
              }
            ],
            educationPaths: [
              {
                level: "Bachelor's Degree",
                duration: "4 years",
                eligibility: "12th with MPC, JEE Main/Advanced",
                subjects: ["Mechanics", "Thermodynamics", "Materials Science", "Manufacturing"],
                outcomes: ["Design Engineer", "Production Engineer", "Quality Engineer"]
              },
              {
                level: "Master's Degree",
                duration: "2 years",
                eligibility: "B.Tech in Mechanical Engineering",
                subjects: ["Advanced Mechanics", "Robotics", "Automation", "Research Methods"],
                outcomes: ["Senior Engineer", "Project Manager", "Research Engineer"]
              }
            ]
          },
          {
            id: "civil-engineering",
            name: "Civil Engineering",
            icon: "🏗️",
            description: "Design and construct infrastructure projects",
            salaryRange: "₹3-10 LPA",
            growth: "10",
            skills: ["Structural Design", "Project Management", "CAD", "Surveying", "Construction"],
            workEnvironment: "Mix of office and construction sites",
            responsibilities: [
              "Design infrastructure projects",
              "Oversee construction activities",
              "Ensure safety standards",
              "Manage project budgets",
              "Coordinate with contractors"
            ],
            prospects: "Good growth with infrastructure development initiatives",
            recommendedCourses: [
              {
                name: "B.Tech Civil Engineering",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Comprehensive civil engineering covering structural design, construction, and project management",
                stream: "Science/Math",
                careerRelevance: "Core qualification for civil engineering roles"
              },
              {
                name: "M.Tech Civil Engineering",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced civil engineering with specialization in structural or transportation engineering",
                stream: "Science/Math",
                careerRelevance: "Required for senior engineering and project management positions"
              },
              {
                name: "Diploma in Engineering",
                level: "Diploma",
                duration: "3 years",
                description: "Technical engineering skills for construction and infrastructure projects",
                stream: "Science",
                careerRelevance: "Entry-level technical positions in construction industry"
              }
            ],
            educationPaths: [
              {
                level: "Bachelor's Degree",
                duration: "4 years",
                eligibility: "12th with MPC, JEE Main/Advanced",
                subjects: ["Structural Engineering", "Geotechnical Engineering", "Transportation", "Environmental"],
                outcomes: ["Site Engineer", "Structural Engineer", "Project Manager"]
              }
            ]
          },
          {
            id: "electrical-engineering",
            name: "Electrical Engineering",
            icon: "⚡",
            description: "Design and maintain electrical systems and power distribution",
            salaryRange: "₹3-11 LPA",
            growth: "13",
            skills: ["Circuit Design", "Power Systems", "Control Systems", "Electronics", "Programming"],
            workEnvironment: "Office and field work, power plants, manufacturing facilities",
            responsibilities: [
              "Design electrical systems",
              "Maintain power distribution",
              "Troubleshoot electrical issues",
              "Ensure safety compliance",
              "Optimize energy efficiency"
            ],
            prospects: "Growing demand with renewable energy and smart grid technologies",
            educationPaths: [
              {
                level: "Bachelor's Degree",
                duration: "4 years",
                eligibility: "12th with MPC, JEE Main/Advanced",
                subjects: ["Circuit Theory", "Power Systems", "Control Systems", "Electronics"],
                outcomes: ["Electrical Engineer", "Power Systems Engineer", "Control Engineer"]
              }
            ]
          }
        ]
      },
      {
        id: "pure-sciences",
        name: "Pure Sciences",
        icon: "🔬",
        description: "Research and study fundamental scientific principles",
        specializations: [
          {
            id: "physics",
            name: "Physics",
            icon: "⚛️",
            description: "Study matter, energy, and their interactions",
            salaryRange: "₹4-12 LPA",
            growth: "11",
            skills: ["Mathematical Analysis", "Research Methods", "Data Analysis", "Problem Solving", "Scientific Writing"],
            workEnvironment: "Research laboratories, universities, government institutions",
            responsibilities: [
              "Conduct scientific research",
              "Analyze experimental data",
              "Publish research findings",
              "Teach and mentor students",
              "Apply for research grants"
            ],
            prospects: "Good opportunities in research and academia",
            recommendedCourses: [
              {
                name: "B.Sc. Physics",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Core physics program covering mechanics, thermodynamics, and quantum physics",
                stream: "Science",
                careerRelevance: "Essential foundation for physics research and teaching"
              },
              {
                name: "M.Sc. Physics",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced physics with specialization in theoretical or applied physics",
                stream: "Science",
                careerRelevance: "Required for research positions and advanced physics careers"
              },
              {
                name: "PhD in Physics",
                level: "PhD",
                duration: "3-5 years",
                description: "Doctoral research in physics and theoretical studies",
                stream: "Science",
                careerRelevance: "Essential for academic positions and advanced research"
              }
            ],
            educationPaths: [
              {
                level: "B.Sc Physics",
                duration: "3 years",
                eligibility: "12th with MPC",
                subjects: ["Classical Mechanics", "Quantum Mechanics", "Thermodynamics", "Electromagnetism"],
                outcomes: ["Research Assistant", "Lab Technician", "Science Teacher"]
              },
              {
                level: "M.Sc Physics",
                duration: "2 years",
                eligibility: "B.Sc Physics",
                subjects: ["Advanced Physics", "Research Methods", "Specialized Topics"],
                outcomes: ["Research Scientist", "Physics Teacher", "Technical Consultant"]
              },
              {
                level: "PhD Physics",
                duration: "3-5 years",
                eligibility: "M.Sc Physics",
                subjects: ["Original Research", "Thesis Work", "Advanced Topics"],
                outcomes: ["Research Professor", "Senior Scientist", "Research Director"]
              }
            ]
          },
          {
            id: "chemistry",
            name: "Chemistry",
            icon: "🧪",
            description: "Study matter, its properties, and chemical reactions",
            salaryRange: "₹3-10 LPA",
            growth: "12",
            skills: ["Laboratory Techniques", "Chemical Analysis", "Research Methods", "Data Interpretation", "Safety Protocols"],
            workEnvironment: "Research laboratories, chemical industries, quality control labs",
            responsibilities: [
              "Conduct chemical experiments",
              "Analyze chemical compounds",
              "Develop new materials",
              "Ensure safety protocols",
              "Document research findings"
            ],
            prospects: "Good opportunities in chemical and pharmaceutical industries",
            recommendedCourses: [
              {
                name: "B.Sc. Chemistry",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Core chemistry program covering organic, inorganic, and physical chemistry",
                stream: "Science",
                careerRelevance: "Essential foundation for chemistry research and industry careers"
              },
              {
                name: "M.Sc. Chemistry",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced chemistry with specialization in analytical or organic chemistry",
                stream: "Science",
                careerRelevance: "Required for senior research positions and teaching roles"
              },
              {
                name: "B.Tech Chemical Engineering",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Chemical engineering with focus on industrial applications",
                stream: "Science/Math",
                careerRelevance: "Excellent for chemical industry and process engineering roles"
              }
            ],
            educationPaths: [
              {
                level: "B.Sc Chemistry",
                duration: "3 years",
                eligibility: "12th with MPC",
                subjects: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Analytical Chemistry"],
                outcomes: ["Lab Technician", "Quality Control Analyst", "Research Assistant"]
              },
              {
                level: "M.Sc Chemistry",
                duration: "2 years",
                eligibility: "B.Sc Chemistry",
                subjects: ["Advanced Chemistry", "Research Methods", "Specialized Areas"],
                outcomes: ["Research Scientist", "Chemistry Teacher", "Analytical Chemist"]
              }
            ]
          }
        ]
      }
    ]
  },
  BiPC: {
    name: "Biology, Physics, Chemistry",
    categories: [
      {
        id: "medicine",
        name: "Medicine & Healthcare",
        icon: "🏥",
        description: "Diagnose, treat, and prevent diseases and injuries",
        specializations: [
          {
            id: "mbbs",
            name: "MBBS (General Medicine)",
            icon: "🩺",
            description: "Primary healthcare and general medical practice",
            salaryRange: "₹6-25 LPA",
            growth: "18",
            skills: ["Diagnosis", "Patient Care", "Medical Knowledge", "Communication", "Problem Solving"],
            workEnvironment: "Hospitals, clinics, private practice",
            responsibilities: [
              "Diagnose and treat patients",
              "Prescribe medications",
              "Order diagnostic tests",
              "Provide preventive care",
              "Maintain patient records"
            ],
            prospects: "Excellent growth with increasing healthcare needs",
            recommendedCourses: [
              {
                name: "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
                level: "Bachelor's Degree",
                duration: "5.5 years",
                description: "Comprehensive medical education covering all aspects of human health and disease",
                stream: "Science",
                careerRelevance: "Essential qualification for becoming a medical doctor"
              },
              {
                name: "MD (Doctor of Medicine)",
                level: "Master's Degree",
                duration: "3 years",
                description: "Specialized medical training in specific medical fields",
                stream: "Science",
                careerRelevance: "Required for medical specialization and advanced practice"
              },
              {
                name: "B.Sc. Nursing",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Nursing education with clinical training",
                stream: "Science",
                careerRelevance: "Alternative healthcare career path with good growth prospects"
              }
            ],
            educationPaths: [
              {
                level: "MBBS",
                duration: "5.5 years",
                eligibility: "12th with BiPC, NEET",
                subjects: ["Anatomy", "Physiology", "Pathology", "Pharmacology", "Clinical Medicine"],
                outcomes: ["General Practitioner", "Resident Doctor", "Medical Officer"]
              },
              {
                level: "MD/MS Specialization",
                duration: "3 years",
                eligibility: "MBBS",
                subjects: ["Specialized Medical Knowledge", "Research Methods", "Clinical Training"],
                outcomes: ["Specialist Doctor", "Consultant", "Senior Medical Officer"]
              }
            ]
          },
          {
            id: "dentistry",
            name: "Dentistry",
            icon: "🦷",
            description: "Diagnose and treat oral health issues",
            salaryRange: "₹4-15 LPA",
            growth: "16",
            skills: ["Dental Procedures", "Patient Care", "Manual Dexterity", "Diagnosis", "Preventive Care"],
            workEnvironment: "Dental clinics, hospitals, private practice",
            responsibilities: [
              "Examine patients' teeth and gums",
              "Perform dental procedures",
              "Provide preventive care",
              "Educate patients on oral hygiene",
              "Maintain dental equipment"
            ],
            prospects: "Good growth with increasing awareness of oral health",
            recommendedCourses: [
              {
                name: "BDS (Bachelor of Dental Surgery)",
                level: "Bachelor's Degree",
                duration: "5 years",
                description: "Comprehensive dental education covering oral health, dental procedures, and patient care",
                stream: "Science",
                careerRelevance: "Essential qualification for becoming a dentist"
              },
              {
                name: "MDS (Master of Dental Surgery)",
                level: "Master's Degree",
                duration: "3 years",
                description: "Specialized dental training in specific areas like orthodontics, oral surgery, or periodontics",
                stream: "Science",
                careerRelevance: "Required for dental specialization and advanced practice"
              },
              {
                name: "B.Sc. Dental Hygiene",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Dental hygiene and preventive oral care education",
                stream: "Science",
                careerRelevance: "Alternative dental career path with focus on preventive care"
              }
            ],
            educationPaths: [
              {
                level: "BDS",
                duration: "5 years",
                eligibility: "12th with BiPC, NEET",
                subjects: ["Oral Anatomy", "Dental Materials", "Oral Pathology", "Clinical Dentistry"],
                outcomes: ["General Dentist", "Dental Surgeon", "Oral Health Specialist"]
              },
              {
                level: "MDS",
                duration: "3 years",
                eligibility: "BDS",
                subjects: ["Specialized Dentistry", "Advanced Procedures", "Research Methods"],
                outcomes: ["Specialist Dentist", "Dental Consultant", "Academic Dentist"]
              }
            ]
          },
          {
            id: "pharmacy",
            name: "Pharmacy",
            icon: "💊",
            description: "Prepare and dispense medications, provide pharmaceutical care",
            salaryRange: "₹3-8 LPA",
            growth: "14",
            skills: ["Pharmacology", "Chemistry", "Patient Counseling", "Drug Interactions", "Regulatory Compliance"],
            workEnvironment: "Pharmacies, hospitals, pharmaceutical companies",
            responsibilities: [
              "Dispense medications",
              "Counsel patients on drug use",
              "Monitor drug interactions",
              "Manage inventory",
              "Ensure regulatory compliance"
            ],
            prospects: "Good growth with expanding pharmaceutical industry",
            recommendedCourses: [
              {
                name: "B.Pharm (Bachelor of Pharmacy)",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Comprehensive pharmaceutical education covering drug preparation, pharmacology, and patient care",
                stream: "Science",
                careerRelevance: "Essential qualification for becoming a pharmacist"
              },
              {
                name: "M.Pharm (Master of Pharmacy)",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced pharmaceutical studies with specialization in clinical or industrial pharmacy",
                stream: "Science",
                careerRelevance: "Required for specialized pharmacy roles and research positions"
              },
              {
                name: "Pharm.D (Doctor of Pharmacy)",
                level: "Master's Degree",
                duration: "6 years",
                description: "Clinical pharmacy program focused on patient care and pharmaceutical practice",
                stream: "Science",
                careerRelevance: "Ideal for clinical pharmacy and direct patient care roles"
              }
            ],
            educationPaths: [
              {
                level: "B.Pharm",
                duration: "4 years",
                eligibility: "12th with BiPC",
                subjects: ["Pharmaceutical Chemistry", "Pharmacology", "Pharmaceutics", "Pharmacognosy"],
                outcomes: ["Pharmacist", "Drug Inspector", "Pharmaceutical Sales"]
              }
            ]
          }
        ]
      },
      {
        id: "biotechnology",
        name: "Biotechnology",
        icon: "🧬",
        description: "Apply biological processes for industrial and medical purposes",
        specializations: [
          {
            id: "biotech-research",
            name: "Biotechnology Research",
            icon: "🔬",
            description: "Research and develop biotechnological solutions",
            salaryRange: "₹4-12 LPA",
            growth: "15",
            skills: ["Molecular Biology", "Laboratory Techniques", "Data Analysis", "Research Methods", "Biostatistics"],
            workEnvironment: "Research laboratories, biotechnology companies, universities",
            responsibilities: [
              "Conduct biotechnological research",
              "Develop new products",
              "Analyze biological data",
              "Maintain laboratory equipment",
              "Publish research findings"
            ],
            prospects: "Excellent growth in pharmaceutical and biotechnology sectors",
            recommendedCourses: [
              {
                name: "B.Tech Biotechnology",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Engineering approach to biotechnology with focus on industrial applications",
                stream: "Science/Math",
                careerRelevance: "Essential for biotechnology engineering and research careers"
              },
              {
                name: "B.Sc. Biotechnology",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Core biotechnology program covering molecular biology and bioprocessing",
                stream: "Science",
                careerRelevance: "Foundation for biotechnology research and laboratory work"
              },
              {
                name: "M.Sc. Biotechnology",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced biotechnology with specialization in research methods",
                stream: "Science",
                careerRelevance: "Required for senior research positions and specialized roles"
              }
            ],
            educationPaths: [
              {
                level: "B.Tech Biotechnology",
                duration: "4 years",
                eligibility: "12th with BiPC, JEE Main/Advanced",
                subjects: ["Molecular Biology", "Biochemistry", "Genetics", "Biostatistics"],
                outcomes: ["Biotech Engineer", "Research Assistant", "Lab Technician"]
              },
              {
                level: "M.Tech Biotechnology",
                duration: "2 years",
                eligibility: "B.Tech Biotechnology",
                subjects: ["Advanced Biotechnology", "Research Methods", "Specialized Areas"],
                outcomes: ["Research Scientist", "Senior Biotech Engineer", "Project Manager"]
              }
            ]
          },
          {
            id: "bioinformatics",
            name: "Bioinformatics",
            icon: "💻",
            description: "Apply computational methods to biological data",
            salaryRange: "₹5-15 LPA",
            growth: "20",
            skills: ["Programming", "Data Analysis", "Statistics", "Biology", "Machine Learning"],
            workEnvironment: "Research institutions, pharmaceutical companies, tech companies",
            responsibilities: [
              "Analyze biological data",
              "Develop computational tools",
              "Create databases",
              "Apply machine learning",
              "Collaborate with biologists"
            ],
            prospects: "Excellent growth with increasing use of big data in biology",
            recommendedCourses: [
              {
                name: "B.Tech Bioinformatics",
                level: "Bachelor's Degree",
                duration: "4 years",
                description: "Combines biology with computer science for data analysis and computational biology",
                stream: "Science/Math",
                careerRelevance: "Essential for bioinformatics careers in research and industry"
              },
              {
                name: "M.Sc. Bioinformatics",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced bioinformatics with focus on genomics and computational biology",
                stream: "Science",
                careerRelevance: "Required for specialized bioinformatics research and analysis roles"
              },
              {
                name: "B.Sc. Bioinformatics",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Core bioinformatics covering biology, statistics, and programming",
                stream: "Science",
                careerRelevance: "Foundation for bioinformatics and computational biology careers"
              }
            ],
            educationPaths: [
              {
                level: "B.Tech Bioinformatics",
                duration: "4 years",
                eligibility: "12th with BiPC, JEE Main/Advanced",
                subjects: ["Programming", "Biology", "Statistics", "Database Management"],
                outcomes: ["Bioinformatics Analyst", "Data Scientist", "Research Assistant"]
              }
            ]
          }
        ]
      },
      {
        id: "life-sciences",
        name: "Life Sciences",
        icon: "🌱",
        description: "Study living organisms and their interactions",
        specializations: [
          {
            id: "microbiology",
            name: "Microbiology",
            icon: "🦠",
            description: "Study microorganisms and their effects",
            salaryRange: "₹3-9 LPA",
            growth: "13",
            skills: ["Laboratory Techniques", "Microscopy", "Sterilization", "Data Analysis", "Research Methods"],
            workEnvironment: "Research laboratories, hospitals, food industry, pharmaceutical companies",
            responsibilities: [
              "Study microorganisms",
              "Conduct experiments",
              "Analyze samples",
              "Maintain sterile conditions",
              "Document findings"
            ],
            prospects: "Good opportunities in healthcare, food, and pharmaceutical industries",
            recommendedCourses: [
              {
                name: "B.Sc. Microbiology",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Study of microorganisms including bacteria, viruses, fungi, and parasites",
                stream: "Science",
                careerRelevance: "Essential foundation for microbiology careers in research and industry"
              },
              {
                name: "M.Sc. Microbiology",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced microbiology with specialization in medical or industrial microbiology",
                stream: "Science",
                careerRelevance: "Required for senior microbiologist positions and research roles"
              },
              {
                name: "B.Sc. Biotechnology",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Biotechnology with strong microbiology components",
                stream: "Science",
                careerRelevance: "Alternative path combining microbiology with biotechnology applications"
              }
            ],
            educationPaths: [
              {
                level: "B.Sc Microbiology",
                duration: "3 years",
                eligibility: "12th with BiPC",
                subjects: ["General Microbiology", "Medical Microbiology", "Industrial Microbiology", "Immunology"],
                outcomes: ["Microbiologist", "Lab Technician", "Quality Control Analyst"]
              },
              {
                level: "M.Sc Microbiology",
                duration: "2 years",
                eligibility: "B.Sc Microbiology",
                subjects: ["Advanced Microbiology", "Research Methods", "Specialized Areas"],
                outcomes: ["Research Scientist", "Senior Microbiologist", "Academic Researcher"]
              }
            ]
          },
          {
            id: "botany",
            name: "Botany",
            icon: "🌿",
            description: "Study plant life and their characteristics",
            salaryRange: "₹3-8 LPA",
            growth: "10",
            skills: ["Plant Identification", "Field Work", "Laboratory Techniques", "Data Collection", "Research Methods"],
            workEnvironment: "Field work, research laboratories, botanical gardens, universities",
            responsibilities: [
              "Study plant species",
              "Conduct field research",
              "Analyze plant samples",
              "Maintain plant collections",
              "Publish research findings"
            ],
            prospects: "Good opportunities in agriculture, conservation, and research",
            educationPaths: [
              {
                level: "B.Sc Botany",
                duration: "3 years",
                eligibility: "12th with BiPC",
                subjects: ["Plant Anatomy", "Plant Physiology", "Taxonomy", "Ecology"],
                outcomes: ["Botanist", "Plant Scientist", "Research Assistant"]
              }
            ]
          }
        ]
      }
    ]
  },
  Commerce: {
    name: "Commerce",
    categories: [
      {
        id: "business-management",
        name: "Business & Management",
        icon: "💼",
        description: "Lead and manage organizations and business operations",
        specializations: [
          {
            id: "business-administration",
            name: "Business Administration",
            icon: "📊",
            description: "Manage business operations and strategic planning",
            salaryRange: "₹4-20 LPA",
            growth: "16",
            skills: ["Leadership", "Strategic Planning", "Financial Management", "Team Management", "Problem Solving"],
            workEnvironment: "Corporate offices, boardrooms, various business settings",
            responsibilities: [
              "Develop business strategies",
              "Manage teams and operations",
              "Make strategic decisions",
              "Oversee financial performance",
              "Build stakeholder relationships"
            ],
            prospects: "Excellent growth opportunities in corporate sector",
            recommendedCourses: [
              {
                name: "BBA (Bachelor of Business Administration)",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Comprehensive business administration covering management, marketing, and finance",
                stream: "Commerce",
                careerRelevance: "Essential foundation for business management careers"
              },
              {
                name: "MBA (Master of Business Administration)",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced business administration with specialization in management and strategy",
                stream: "Commerce",
                careerRelevance: "Required for senior management and executive positions"
              },
              {
                name: "Diploma in Business Management",
                level: "Diploma",
                duration: "1 year",
                description: "Practical business management and administration skills",
                stream: "Commerce",
                careerRelevance: "Quick entry into business operations and management"
              }
            ],
            educationPaths: [
              {
                level: "BBA",
                duration: "3 years",
                eligibility: "12th Commerce",
                subjects: ["Business Management", "Economics", "Accounting", "Marketing"],
                outcomes: ["Business Analyst", "Management Trainee", "Operations Manager"]
              },
              {
                level: "MBA",
                duration: "2 years",
                eligibility: "Graduation + CAT/MAT/XAT",
                subjects: ["Strategic Management", "Finance", "Marketing", "Operations"],
                outcomes: ["Senior Manager", "Business Consultant", "Entrepreneur"]
              }
            ]
          },
          {
            id: "marketing",
            name: "Marketing",
            icon: "📈",
            description: "Promote products and services to target customers",
            salaryRange: "₹3-15 LPA",
            growth: "14",
            skills: ["Digital Marketing", "Brand Management", "Market Research", "Communication", "Analytics"],
            workEnvironment: "Marketing agencies, corporate offices, remote work options",
            responsibilities: [
              "Develop marketing strategies",
              "Create promotional campaigns",
              "Analyze market trends",
              "Manage brand image",
              "Measure campaign effectiveness"
            ],
            prospects: "Good growth with digital transformation",
            recommendedCourses: [
              {
                name: "BBA in Marketing",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Business administration with specialization in marketing and consumer behavior",
                stream: "Commerce",
                careerRelevance: "Essential foundation for marketing careers"
              },
              {
                name: "MBA in Marketing",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced marketing management with digital marketing focus",
                stream: "Commerce",
                careerRelevance: "Required for senior marketing positions and management roles"
              },
              {
                name: "B.Com. in Digital Marketing",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Commerce with focus on digital marketing and online business",
                stream: "Commerce",
                careerRelevance: "Perfect for digital marketing and e-commerce careers"
              }
            ],
            educationPaths: [
              {
                level: "BBA Marketing",
                duration: "3 years",
                eligibility: "12th Commerce",
                subjects: ["Marketing Principles", "Consumer Behavior", "Advertising", "Digital Marketing"],
                outcomes: ["Marketing Executive", "Brand Manager", "Digital Marketing Specialist"]
              },
              {
                level: "MBA Marketing",
                duration: "2 years",
                eligibility: "Graduation + CAT/MAT/XAT",
                subjects: ["Advanced Marketing", "Brand Management", "Market Research", "Digital Strategy"],
                outcomes: ["Marketing Manager", "Brand Director", "Marketing Consultant"]
              }
            ]
          },
          {
            id: "human-resources",
            name: "Human Resources",
            icon: "👥",
            description: "Manage workforce and organizational development",
            salaryRange: "₹3-12 LPA",
            growth: "13",
            skills: ["Recruitment", "Employee Relations", "Training", "Performance Management", "HR Analytics"],
            workEnvironment: "Corporate offices, HR departments, consulting firms",
            responsibilities: [
              "Recruit and hire employees",
              "Manage employee relations",
              "Develop training programs",
              "Handle performance reviews",
              "Ensure compliance with labor laws"
            ],
            prospects: "Steady growth with focus on talent management",
            educationPaths: [
              {
                level: "BBA HR",
                duration: "3 years",
                eligibility: "12th Commerce",
                subjects: ["Human Resource Management", "Organizational Behavior", "Labor Laws", "Training"],
                outcomes: ["HR Executive", "Recruiter", "Training Coordinator"]
              },
              {
                level: "MBA HR",
                duration: "2 years",
                eligibility: "Graduation + CAT/MAT/XAT",
                subjects: ["Strategic HR", "Talent Management", "Employee Relations", "HR Analytics"],
                outcomes: ["HR Manager", "Talent Acquisition Head", "HR Consultant"]
              }
            ]
          }
        ]
      },
      {
        id: "finance",
        name: "Finance & Accounting",
        icon: "💰",
        description: "Manage financial resources and accounting systems",
        specializations: [
          {
            id: "chartered-accountancy",
            name: "Chartered Accountancy",
            icon: "📋",
            description: "Provide accounting, auditing, and financial advisory services",
            salaryRange: "₹6-25 LPA",
            growth: "17",
            skills: ["Accounting", "Auditing", "Taxation", "Financial Analysis", "Compliance"],
            workEnvironment: "Accounting firms, corporate finance departments, consulting",
            responsibilities: [
              "Prepare financial statements",
              "Conduct audits",
              "Provide tax advice",
              "Ensure regulatory compliance",
              "Offer financial consulting"
            ],
            prospects: "Excellent growth with increasing regulatory requirements",
            educationPaths: [
              {
                level: "CA Foundation",
                duration: "6 months",
                eligibility: "12th Commerce",
                subjects: ["Accounting", "Business Laws", "Mathematics", "Economics"],
                outcomes: ["CA Student", "Accounting Assistant"]
              },
              {
                level: "CA Intermediate",
                duration: "8 months",
                eligibility: "CA Foundation",
                subjects: ["Advanced Accounting", "Auditing", "Taxation", "Cost Accounting"],
                outcomes: ["CA Intermediate Student", "Audit Assistant"]
              },
              {
                level: "CA Final",
                duration: "6 months",
                eligibility: "CA Intermediate + Articleship",
                subjects: ["Advanced Auditing", "Strategic Financial Management", "Direct Tax", "Indirect Tax"],
                outcomes: ["Chartered Accountant", "Financial Advisor", "Tax Consultant"]
              }
            ]
          },
          {
            id: "investment-banking",
            name: "Investment Banking",
            icon: "🏦",
            description: "Help companies raise capital and provide financial advisory",
            salaryRange: "₹8-30 LPA",
            growth: "19",
            skills: ["Financial Modeling", "Valuation", "Deal Structuring", "Market Analysis", "Client Relations"],
            workEnvironment: "Investment banks, financial institutions, corporate offices",
            responsibilities: [
              "Structure financial deals",
              "Conduct market analysis",
              "Prepare pitch books",
              "Manage client relationships",
              "Execute transactions"
            ],
            prospects: "High growth with increasing M&A activity",
            educationPaths: [
              {
                level: "B.Com + CFA",
                duration: "3 years + 2-3 years",
                eligibility: "12th Commerce",
                subjects: ["Finance", "Economics", "Statistics", "Investment Analysis"],
                outcomes: ["Investment Analyst", "Financial Analyst", "Portfolio Manager"]
              },
              {
                level: "MBA Finance",
                duration: "2 years",
                eligibility: "Graduation + CAT/MAT/XAT",
                subjects: ["Corporate Finance", "Investment Banking", "Risk Management", "Financial Markets"],
                outcomes: ["Investment Banker", "Financial Advisor", "Risk Manager"]
              }
            ]
          },
          {
            id: "banking",
            name: "Banking",
            icon: "🏛️",
            description: "Provide financial services and manage banking operations",
            salaryRange: "₹4-15 LPA",
            growth: "12",
            skills: ["Customer Service", "Financial Products", "Risk Assessment", "Compliance", "Sales"],
            workEnvironment: "Banks, financial institutions, customer service centers",
            responsibilities: [
              "Handle customer accounts",
              "Process loans and credit",
              "Provide financial advice",
              "Ensure regulatory compliance",
              "Manage banking operations"
            ],
            prospects: "Steady growth with digital banking transformation",
            educationPaths: [
              {
                level: "B.Com",
                duration: "3 years",
                eligibility: "12th Commerce",
                subjects: ["Accounting", "Banking", "Economics", "Business Studies"],
                outcomes: ["Bank Clerk", "Banking Assistant", "Customer Service Representative"]
              },
              {
                level: "Banking Exams",
                duration: "1-2 years preparation",
                eligibility: "Graduation",
                subjects: ["Quantitative Aptitude", "Reasoning", "English", "Banking Knowledge"],
                outcomes: ["Probationary Officer", "Specialist Officer", "Manager"]
              }
            ]
          }
        ]
      },
      {
        id: "entrepreneurship",
        name: "Entrepreneurship",
        icon: "🚀",
        description: "Start and manage your own business ventures",
        specializations: [
          {
            id: "startup-entrepreneur",
            name: "Startup Entrepreneur",
            icon: "💡",
            description: "Launch and scale innovative business ventures",
            salaryRange: "Variable (₹0-50+ LPA)",
            growth: "Variable",
            skills: ["Innovation", "Risk Management", "Leadership", "Networking", "Persistence"],
            workEnvironment: "Startup offices, co-working spaces, home offices",
            responsibilities: [
              "Develop business ideas",
              "Create business plans",
              "Raise funding",
              "Build teams",
              "Scale operations"
            ],
            prospects: "High risk, high reward with potential for significant growth",
            educationPaths: [
              {
                level: "B.Com + Business Incubation",
                duration: "3 years + ongoing",
                eligibility: "12th Commerce",
                subjects: ["Business Planning", "Marketing", "Finance", "Technology"],
                outcomes: ["Startup Founder", "Business Owner", "Innovation Consultant"]
              },
              {
                level: "MBA Entrepreneurship",
                duration: "2 years",
                eligibility: "Graduation + CAT/MAT/XAT",
                subjects: ["Entrepreneurship", "Venture Capital", "Innovation Management", "Startup Strategy"],
                outcomes: ["Serial Entrepreneur", "Startup Advisor", "Venture Capitalist"]
              }
            ]
          }
        ]
      }
    ]
  },
  Arts: {
    name: "Arts",
    categories: [
      {
        id: "social-sciences",
        name: "Social Sciences",
        icon: "🌍",
        description: "Study human society and social relationships",
        specializations: [
          {
            id: "psychology",
            name: "Psychology",
            icon: "🧠",
            description: "Study human behavior and mental processes",
            salaryRange: "₹3-12 LPA",
            growth: "15",
            skills: ["Counseling", "Research Methods", "Data Analysis", "Communication", "Empathy"],
            workEnvironment: "Clinics, hospitals, schools, research institutions, private practice",
            responsibilities: [
              "Assess mental health",
              "Provide counseling",
              "Conduct research",
              "Develop treatment plans",
              "Maintain client records"
            ],
            prospects: "Growing demand for mental health services",
            recommendedCourses: [
              {
                name: "B.A. in Psychology",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Psychology and human behavior studies with research methods",
                stream: "Arts/Humanities",
                careerRelevance: "Essential foundation for psychology careers and counseling"
              },
              {
                name: "M.A. in Psychology",
                level: "Master's Degree",
                duration: "2 years",
                description: "Advanced psychology with specialization in clinical or counseling psychology",
                stream: "Arts/Humanities",
                careerRelevance: "Required for professional psychology practice and therapy"
              },
              {
                name: "B.Sc. in Psychology",
                level: "Bachelor's Degree",
                duration: "3 years",
                description: "Science-based psychology with focus on research and statistics",
                stream: "Science",
                careerRelevance: "Better for research-oriented psychology careers"
              }
            ],
            educationPaths: [
              {
                level: "B.A Psychology",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["General Psychology", "Abnormal Psychology", "Social Psychology", "Research Methods"],
                outcomes: ["Counselor", "Research Assistant", "Social Worker"]
              },
              {
                level: "M.A Psychology",
                duration: "2 years",
                eligibility: "B.A Psychology",
                subjects: ["Clinical Psychology", "Counseling Psychology", "Research Methods", "Thesis"],
                outcomes: ["Clinical Psychologist", "Counseling Psychologist", "Research Psychologist"]
              },
              {
                level: "M.Phil/PhD Psychology",
                duration: "2-5 years",
                eligibility: "M.A Psychology",
                subjects: ["Advanced Research", "Specialized Areas", "Thesis Work"],
                outcomes: ["Research Psychologist", "Professor", "Senior Clinical Psychologist"]
              }
            ]
          },
          {
            id: "sociology",
            name: "Sociology",
            icon: "👥",
            description: "Study society, social behavior, and social institutions",
            salaryRange: "₹3-10 LPA",
            growth: "12",
            skills: ["Research Methods", "Data Analysis", "Social Theory", "Communication", "Critical Thinking"],
            workEnvironment: "Research institutions, NGOs, government agencies, universities",
            responsibilities: [
              "Conduct social research",
              "Analyze social trends",
              "Develop social programs",
              "Write research reports",
              "Advise on social policies"
            ],
            prospects: "Good opportunities in research and social development",
            educationPaths: [
              {
                level: "B.A Sociology",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["Sociological Theory", "Research Methods", "Social Problems", "Indian Society"],
                outcomes: ["Social Researcher", "Community Worker", "Policy Analyst"]
              },
              {
                level: "M.A Sociology",
                duration: "2 years",
                eligibility: "B.A Sociology",
                subjects: ["Advanced Sociology", "Research Methods", "Specialized Areas", "Thesis"],
                outcomes: ["Sociologist", "Research Associate", "Social Policy Advisor"]
              }
            ]
          },
          {
            id: "political-science",
            name: "Political Science",
            icon: "🏛️",
            description: "Study government, politics, and political behavior",
            salaryRange: "₹3-15 LPA",
            growth: "13",
            skills: ["Political Analysis", "Research Methods", "Public Speaking", "Critical Thinking", "Writing"],
            workEnvironment: "Government offices, research institutions, media, NGOs",
            responsibilities: [
              "Analyze political systems",
              "Research policy issues",
              "Write reports and articles",
              "Advise on political matters",
              "Engage in public discourse"
            ],
            prospects: "Good opportunities in government and policy research",
            educationPaths: [
              {
                level: "B.A Political Science",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["Political Theory", "Indian Politics", "International Relations", "Public Administration"],
                outcomes: ["Policy Analyst", "Research Assistant", "Political Commentator"]
              },
              {
                level: "M.A Political Science",
                duration: "2 years",
                eligibility: "B.A Political Science",
                subjects: ["Advanced Political Theory", "Research Methods", "Specialized Areas", "Thesis"],
                outcomes: ["Political Scientist", "Policy Advisor", "Academic Researcher"]
              }
            ]
          }
        ]
      },
      {
        id: "humanities",
        name: "Humanities",
        icon: "📚",
        description: "Study human culture, history, and literature",
        specializations: [
          {
            id: "history",
            name: "History",
            icon: "📜",
            description: "Study past events and their impact on society",
            salaryRange: "₹3-8 LPA",
            growth: "10",
            skills: ["Research Methods", "Critical Analysis", "Writing", "Archival Work", "Teaching"],
            workEnvironment: "Universities, museums, archives, research institutions",
            responsibilities: [
              "Research historical events",
              "Analyze historical documents",
              "Write historical accounts",
              "Teach history",
              "Curate museum exhibits"
            ],
            prospects: "Good opportunities in academia and cultural institutions",
            educationPaths: [
              {
                level: "B.A History",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["Ancient History", "Medieval History", "Modern History", "World History"],
                outcomes: ["History Teacher", "Research Assistant", "Museum Guide"]
              },
              {
                level: "M.A History",
                duration: "2 years",
                eligibility: "B.A History",
                subjects: ["Advanced History", "Research Methods", "Specialized Periods", "Thesis"],
                outcomes: ["Historian", "History Professor", "Museum Curator"]
              }
            ]
          },
          {
            id: "literature",
            name: "Literature",
            icon: "📖",
            description: "Study written works and their cultural significance",
            salaryRange: "₹3-9 LPA",
            growth: "11",
            skills: ["Critical Analysis", "Writing", "Communication", "Research", "Teaching"],
            workEnvironment: "Universities, publishing houses, media, cultural institutions",
            responsibilities: [
              "Analyze literary works",
              "Write literary criticism",
              "Teach literature",
              "Edit and publish works",
              "Conduct literary research"
            ],
            prospects: "Good opportunities in education and publishing",
            educationPaths: [
              {
                level: "B.A English Literature",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["English Literature", "Literary Theory", "Creative Writing", "Linguistics"],
                outcomes: ["English Teacher", "Content Writer", "Editor"]
              },
              {
                level: "M.A English Literature",
                duration: "2 years",
                eligibility: "B.A English Literature",
                subjects: ["Advanced Literature", "Literary Criticism", "Research Methods", "Thesis"],
                outcomes: ["Literature Professor", "Literary Critic", "Publishing Editor"]
              }
            ]
          }
        ]
      },
      {
        id: "media-communication",
        name: "Media & Communication",
        icon: "📺",
        description: "Create and manage media content and communications",
        specializations: [
          {
            id: "journalism",
            name: "Journalism",
            icon: "📰",
            description: "Gather, write, and present news and information",
            salaryRange: "₹3-12 LPA",
            growth: "14",
            skills: ["Writing", "Research", "Interviewing", "Digital Media", "Ethics"],
            workEnvironment: "Newsrooms, field locations, digital platforms, broadcasting studios",
            responsibilities: [
              "Gather news and information",
              "Write news articles",
              "Conduct interviews",
              "Report on events",
              "Maintain ethical standards"
            ],
            prospects: "Good growth with digital media expansion",
            educationPaths: [
              {
                level: "B.A Journalism",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["News Writing", "Media Ethics", "Digital Journalism", "Broadcasting"],
                outcomes: ["Reporter", "News Writer", "Content Creator"]
              },
              {
                level: "M.A Journalism",
                duration: "2 years",
                eligibility: "B.A Journalism",
                subjects: ["Advanced Journalism", "Media Research", "Specialized Reporting", "Thesis"],
                outcomes: ["Senior Journalist", "Editor", "Media Manager"]
              }
            ]
          },
          {
            id: "mass-communication",
            name: "Mass Communication",
            icon: "📡",
            description: "Create and manage communication across various media platforms",
            salaryRange: "₹3-10 LPA",
            growth: "13",
            skills: ["Content Creation", "Media Production", "Digital Marketing", "Communication", "Creativity"],
            workEnvironment: "Media companies, advertising agencies, corporate communications",
            responsibilities: [
              "Create media content",
              "Manage communication campaigns",
              "Produce multimedia content",
              "Handle public relations",
              "Manage social media"
            ],
            prospects: "Good opportunities in digital media and corporate communications",
            educationPaths: [
              {
                level: "B.A Mass Communication",
                duration: "3 years",
                eligibility: "12th Arts",
                subjects: ["Media Studies", "Communication Theory", "Production Techniques", "Digital Media"],
                outcomes: ["Media Producer", "Communication Specialist", "Content Manager"]
              }
            ]
          }
        ]
      }
    ]
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = careerData;
}

