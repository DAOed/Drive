
import Landing from "@views/Landing/Index.vue"

export default [
  {
    path: "/",
    name: "Landing",
    component: Landing,
    meta: {
      title: "Decentralized & encrypted storage you own and control - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Encrypted, decentralized, secure and free storage on DAOed Drive. Upload, download, manage and share files."
        },
        {
          property: "og:description",
          content: "Encrypted, decentralized, secure and free storage on DAOed Drive. Upload, download, manage and share files."
        }
      ]
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import(/* webpackChunkName: "dashboard" */ "../views/Dashboard/Index.vue"),
    meta: {
      title: "Dashboard - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Dashboard of your decentralized DAOed Drive. Securely manage your encrypted files on DAOed Drive."
        },
        {
          property: "og:description",
          content: "Dashboard of your decentralized DAOed Drive. Securely manage your encrypted files on DAOed Drive."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/files",
    name: "Files",
    component: () => import(/* webpackChunkName: "files" */ "../views/Files/Index.vue"),
    meta: {
      title: "Files - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Manage your files on the decentralized DAOed Drive. Use folders to categorize you file, save bookmarks and download."
        },
        {
          property: "og:description",
          content: "Manage your files on the decentralized DAOed Drive. Use folders to categorize you file, save bookmarks and download."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/starred",
    name: "Starred",
    component: () => import(/* webpackChunkName: "starred" */ "../views/Starred/Index.vue"),
    meta: {
      title: "Starred - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Manage your favorite files and folders on your decentralized DAOed Drive."
        },
        {
          property: "og:description",
          content: "Manage your favorite files and folders on your decentralized DAOed Drive."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/trash",
    name: "Trash",
    component: () => import(/* webpackChunkName: "trash" */ "../views/Trash/Index.vue"),
    meta: {
      title: "Trash - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Manage trashed files and folders on the decentralized DAOed Drive. Download, restore or permanently delete files."
        },
        {
          property: "og:description",
          content: "Manage trashed files and folders on the decentralized DAOed Drive. Download, restore or permanently delete files."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/console",
    name: "Console",
    component: () => import(/* webpackChunkName: "console" */ "../views/Console/Index.vue"),
    meta: {
      title: "Console - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "View and manage all files on your decentralized DAOed Drive using the console."
        },
        {
          property: "og:description",
          content: "View and manage all files on your decentralized DAOed Drive using the console."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import(/* webpackChunkName: "settings" */ "../views/Settings/Index.vue"),
    meta: {
      title: "Settings - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Configure your DAOed Drive settings."
        },
        {
          property: "og:description",
          content: "Configure your DAOed Drive settings."
        }
      ],
      requiresAuth: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    meta: {
      title: "About - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "About your DAOed Drive."
        },
        {
          property: "og:description",
          content: "About your DAOed Drive."
        }
      ]
    }
  },
  {
    path: "/faqs",
    name: "FAQs",
    component: () => import(/* webpackChunkName: "faqs" */ "../views/FAQs.vue"),
    meta: {
      title: "FAQs - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Frequently Asked Questions about the decentralized DAOed Drive."
        },
        {
          property: "og:description",
          content: "Frequently Asked Questions about the decentralized DAOed Drive."
        }
      ]
    }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      title: "Login - DAOed Drive",
      metaTags: [
        {
          name: "description",
          content: "Securely login to your decentralized DAOed Drive."
        },
        {
          property: "og:description",
          content: "Securely login to your decentralized DAOed Drive."
        }
      ]
    }
  }
]
