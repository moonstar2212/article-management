import { Article, Category, User } from "@/types";

export const dummyCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Health",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Business",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Sports",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "5",
    name: "Entertainment",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
];

export const dummyArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence",
    content:
      "Artificial intelligence (AI) is revolutionizing industries across the globe. From healthcare to finance, AI is transforming how we work, live, and interact with technology. Machine learning algorithms are becoming more sophisticated, enabling computers to perform tasks that once required human intelligence. Natural language processing is improving communication between humans and machines, while computer vision systems are enhancing how machines perceive and interpret the world. As AI continues to evolve, we can expect to see even more innovative applications and advancements in the coming years.",
    categoryId: "1",
    category: dummyCategories[0],
    createdAt: "2023-02-01T00:00:00.000Z",
    updatedAt: "2023-02-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Tips for a Healthy Lifestyle",
    content:
      "Maintaining a healthy lifestyle is essential for overall well-being. Regular exercise, a balanced diet, and adequate sleep are fundamental components of good health. Physical activity not only helps maintain a healthy weight but also improves cardiovascular health, strengthens muscles, and enhances mood. A nutritious diet rich in fruits, vegetables, lean proteins, and whole grains provides the necessary nutrients for optimal body function. Additionally, getting enough quality sleep is crucial for recovery, cognitive function, and immune system support. By incorporating these habits into your daily routine, you can improve your quality of life and reduce the risk of chronic diseases.",
    categoryId: "2",
    category: dummyCategories[1],
    createdAt: "2023-02-02T00:00:00.000Z",
    updatedAt: "2023-02-02T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Cryptocurrency Market Trends",
    content:
      "The cryptocurrency market continues to evolve rapidly, with Bitcoin and Ethereum leading the way. Market volatility remains a key characteristic, with prices fluctuating dramatically in response to regulatory news, technological developments, and broader economic factors. Institutional adoption has increased significantly, with more companies adding crypto to their balance sheets and investment portfolios. Decentralized finance (DeFi) applications are expanding, offering alternative financial services outside traditional banking systems. As blockchain technology matures, we can expect increasing integration with existing financial infrastructure and potentially more stable market conditions in the long term.",
    categoryId: "3",
    category: dummyCategories[2],
    createdAt: "2023-02-03T00:00:00.000Z",
    updatedAt: "2023-02-03T00:00:00.000Z",
  },
  {
    id: "4",
    title: "Latest Innovations in Smartphone Technology",
    content:
      "Smartphone technology continues to advance at an impressive pace. Foldable displays are becoming more refined, offering users new form factors and versatility. Camera systems now rival professional equipment, with computational photography enhancing image quality beyond the limitations of hardware. Battery technology improvements provide longer usage times, while fast charging capabilities reduce downtime. Enhanced connectivity with 5G support enables faster data speeds and lower latency for applications. Artificial intelligence integration is making devices smarter and more personalized through features like voice assistants, adaptive battery management, and photography enhancements. These innovations collectively transform how we use and interact with our mobile devices.",
    categoryId: "1",
    category: dummyCategories[0],
    createdAt: "2023-02-04T00:00:00.000Z",
    updatedAt: "2023-02-04T00:00:00.000Z",
  },
  {
    id: "5",
    title: "Mental Health Awareness",
    content:
      "Mental health awareness has grown significantly in recent years, reducing stigma and promoting open conversations. Recognizing the importance of mental well-being alongside physical health is crucial for overall wellness. Stress management techniques, including meditation, mindfulness, and regular exercise, can help maintain emotional balance. Professional support from therapists, counselors, or psychiatrists provides valuable assistance for managing conditions like anxiety, depression, and other mental health disorders. Creating supportive environments at home, work, and in communities fosters better mental health outcomes for everyone. By prioritizing mental health education and resources, we can build more resilient and compassionate societies.",
    categoryId: "2",
    category: dummyCategories[1],
    createdAt: "2023-02-05T00:00:00.000Z",
    updatedAt: "2023-02-05T00:00:00.000Z",
  },
  {
    id: "6",
    title: "Small Business Growth Strategies",
    content:
      "Effective growth strategies are essential for small businesses looking to expand their operations and increase profitability. Digital marketing offers cost-effective ways to reach target audiences through social media, search engine optimization, and content marketing. Customer relationship management systems help maintain strong connections with existing clients while identifying opportunities for additional sales. Strategic partnerships with complementary businesses can provide access to new markets and resources. Diversifying product or service offerings responds to changing market demands and creates multiple revenue streams. Investing in employee development ensures a skilled workforce capable of supporting business expansion and innovation.",
    categoryId: "3",
    category: dummyCategories[2],
    createdAt: "2023-02-06T00:00:00.000Z",
    updatedAt: "2023-02-06T00:00:00.000Z",
  },
  {
    id: "7",
    title: "World Cup Highlights",
    content:
      "The FIFA World Cup delivered thrilling moments of sporting excellence and international competition. Spectacular goals, extraordinary saves, and tactical masterpieces defined the tournament. Underdog teams surprised spectators by defeating established soccer powerhouses, demonstrating the growing global balance in the sport. Individual performances showcased both emerging talents and established stars at the peak of their abilities. The tournament united fans worldwide through a shared passion for soccer, despite political and cultural differences. Beyond the competitive aspects, the World Cup celebrated the universal language of sport and its power to inspire future generations of athletes.",
    categoryId: "4",
    category: dummyCategories[3],
    createdAt: "2023-02-07T00:00:00.000Z",
    updatedAt: "2023-02-07T00:00:00.000Z",
  },
  {
    id: "8",
    title: "Movie Industry Trends",
    content:
      "The movie industry is experiencing significant shifts in production, distribution, and consumption. Streaming platforms have revolutionized how audiences access content, challenging traditional theatrical release models. International productions are gaining wider recognition, diversifying storytelling perspectives and expanding market opportunities. Advanced visual effects technologies create increasingly realistic and immersive viewing experiences. The pandemic accelerated industry changes, prompting studios to adapt release strategies and production protocols. Despite technological advancements, compelling storytelling remains the foundation of successful films, connecting with audiences through authentic emotional experiences. As the industry evolves, the balance between technological innovation and creative artistry continues to define cinematic excellence.",
    categoryId: "5",
    category: dummyCategories[4],
    createdAt: "2023-02-08T00:00:00.000Z",
    updatedAt: "2023-02-08T00:00:00.000Z",
  },
  {
    id: "9",
    title: "Cloud Computing Solutions for Business",
    content:
      "Cloud computing offers transformative solutions for businesses of all sizes. Infrastructure as a Service (IaaS) provides scalable computing resources without major capital investments. Platform as a Service (PaaS) enables developers to build applications using provider-managed development tools and infrastructure. Software as a Service (SaaS) delivers applications over the internet on a subscription basis, eliminating installation and maintenance requirements. Cloud adoption improves operational agility, allowing businesses to rapidly adjust resources according to changing needs. Enhanced collaboration features support remote work environments by providing secure access to shared documents and applications. While concerns about security and data privacy persist, robust cloud security measures continue to advance alongside the technology itself.",
    categoryId: "1",
    category: dummyCategories[0],
    createdAt: "2023-02-09T00:00:00.000Z",
    updatedAt: "2023-02-09T00:00:00.000Z",
  },
  {
    id: "10",
    title: "Nutrition Myths Debunked",
    content:
      "Many common nutrition beliefs lack scientific support despite widespread acceptance. The notion that certain foods significantly boost metabolism has been exaggerated; while some ingredients have minor effects, overall calorie balance remains most important for weight management. Claims about superfoods often overstate their benefits; while nutritious, no single food provides all necessary nutrients. Detox diets are generally unnecessary as the body has sophisticated systems for eliminating waste through the liver and kidneys. Contrary to popular belief, eating smaller, frequent meals doesn't necessarily increase metabolism compared to fewer, larger meals with the same total calories. By understanding evidence-based nutrition principles rather than following trends, individuals can make more informed dietary choices.",
    categoryId: "2",
    category: dummyCategories[1],
    createdAt: "2023-02-10T00:00:00.000Z",
    updatedAt: "2023-02-10T00:00:00.000Z",
  },
  {
    id: "11",
    title: "Sustainable Business Practices",
    content:
      "Sustainable business practices benefit both the environment and corporate performance. Energy efficiency initiatives reduce operational costs while decreasing carbon footprints through improved building design, equipment upgrades, and renewable energy adoption. Waste reduction strategies minimize environmental impact and often reveal process inefficiencies that can be addressed for additional savings. Sustainable supply chain management ensures ethical sourcing while potentially securing more reliable and quality materials. Green product design attracts environmentally conscious consumers who increasingly consider sustainability in purchasing decisions. Beyond operational benefits, sustainable practices enhance brand reputation, attract talent, satisfy investor demands for environmental responsibility, and position companies favorably within evolving regulatory frameworks.",
    categoryId: "3",
    category: dummyCategories[2],
    createdAt: "2023-02-11T00:00:00.000Z",
    updatedAt: "2023-02-11T00:00:00.000Z",
  },
  {
    id: "12",
    title: "Olympic Athletes Training Regimens",
    content:
      "Olympic athletes follow rigorous training regimens to achieve peak performance at the world's most prestigious sporting event. Physical conditioning incorporates sport-specific training with strength, endurance, flexibility, and recovery components tailored to individual needs. Technical skill development focuses on perfecting movements through thousands of repetitions under varying conditions and pressures. Psychological preparation builds mental resilience through visualization, concentration exercises, and strategies for managing competitive stress. Nutritional protocols ensure optimal fueling, hydration, and recovery through carefully designed meal plans. Periodization structures training cycles to peak at competition time, with varying intensity and focus throughout the four-year Olympic cycle. This comprehensive approach represents the extreme dedication required to compete at the highest levels of international sport.",
    categoryId: "4",
    category: dummyCategories[3],
    createdAt: "2023-02-12T00:00:00.000Z",
    updatedAt: "2023-02-12T00:00:00.000Z",
  },
];

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    token: "dummy-user-token",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    token: "dummy-admin-token",
  },
];
