// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="p1-linux-sysadmin.html"><strong aria-hidden="true">1.</strong> Linux Systems Administration</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="1a-history-linux-unix.html"><strong aria-hidden="true">1.1.</strong> History of Unix and Linux</a></li><li class="chapter-item expanded "><a href="1b-what-is-linux.html"><strong aria-hidden="true">1.2.</strong> What is Linux?</a></li><li class="chapter-item expanded "><a href="1c-what-is-sysadmin.html"><strong aria-hidden="true">1.3.</strong> What is Systems Administration?</a></li></ol></li><li class="chapter-item expanded "><a href="p2-project-management.html"><strong aria-hidden="true">2.</strong> Project Management</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="2a-using-gcloud-virtual-machines.html"><strong aria-hidden="true">2.1.</strong> Using gcloud for Virtual Machines</a></li><li class="chapter-item expanded "><a href="2b-using-git-github-for-documentation.html"><strong aria-hidden="true">2.2.</strong> Using Git and GitHub for Documentation</a></li></ol></li><li class="chapter-item expanded "><a href="p3-the-command-line.html"><strong aria-hidden="true">3.</strong> Learning the Command Line</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="3a-the-linux-filesystem.html"><strong aria-hidden="true">3.1.</strong> The Linux Filesystem</a></li><li class="chapter-item expanded "><a href="3b-files-and-directories.html"><strong aria-hidden="true">3.2.</strong> Files and Directories</a></li><li class="chapter-item expanded "><a href="3c-file-perms-owns.html"><strong aria-hidden="true">3.3.</strong> File Permissions and Ownership</a></li><li class="chapter-item expanded "><a href="3d-text-processing-part-1.html"><strong aria-hidden="true">3.4.</strong> Text Processing: Part 1</a></li><li class="chapter-item expanded "><a href="3e-text-processing-part-2.html"><strong aria-hidden="true">3.5.</strong> Text Processing: Part 2</a></li><li class="chapter-item expanded "><a href="3f-regular-expressions.html"><strong aria-hidden="true">3.6.</strong> Regular Expressions</a></li><li class="chapter-item expanded "><a href="3g-review.html"><strong aria-hidden="true">3.7.</strong> Review</a></li></ol></li><li class="chapter-item expanded "><a href="p4-scripting-the-command-line.html"><strong aria-hidden="true">4.</strong> Scripting the Command Line</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="4a-text-editors.html"><strong aria-hidden="true">4.1.</strong> Text Editors</a></li><li class="chapter-item expanded "><a href="4b-bash-scripting.html"><strong aria-hidden="true">4.2.</strong> Bash Scripting</a></li></ol></li><li class="chapter-item expanded "><a href="p5-managing-the-system.html"><strong aria-hidden="true">5.</strong> Managing the System</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="5a-expanding-storage.html"><strong aria-hidden="true">5.1.</strong> Expanding Storage</a></li><li class="chapter-item expanded "><a href="5b-managing-users-groups.html"><strong aria-hidden="true">5.2.</strong> Managing Users and Groups</a></li><li class="chapter-item expanded "><a href="5c-managing-software.html"><strong aria-hidden="true">5.3.</strong> Managing Software</a></li><li class="chapter-item expanded "><a href="5d-using-systemd.html"><strong aria-hidden="true">5.4.</strong> Using systemd</a></li></ol></li><li class="chapter-item expanded "><a href="p6-networking-security.html"><strong aria-hidden="true">6.</strong> Networking and Security</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="6a-networking-tcpip.html"><strong aria-hidden="true">6.1.</strong> Networking and TCP/IP</a></li><li class="chapter-item expanded "><a href="6b-dns-domain-names.html"><strong aria-hidden="true">6.2.</strong> DNS and Domain Names</a></li><li class="chapter-item expanded "><a href="6c-local-security.html"><strong aria-hidden="true">6.3.</strong> Local Security</a></li><li class="chapter-item expanded "><a href="6d-firewall-backups.html"><strong aria-hidden="true">6.4.</strong> Firewalls and Backups</a></li></ol></li><li class="chapter-item expanded "><a href="p7-creating-a-lamp-server.html"><strong aria-hidden="true">7.</strong> Creating a LAMP Server</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="7a-installing-the-apache-web-server.html"><strong aria-hidden="true">7.1.</strong> Installing the Apache Web Server</a></li><li class="chapter-item expanded "><a href="7b-installing-configuring-php.html"><strong aria-hidden="true">7.2.</strong> Installing and Configuring PHP</a></li><li class="chapter-item expanded "><a href="7c-installing-configuring-mariadb.html"><strong aria-hidden="true">7.3.</strong> Installing and Configuring MariaDB</a></li><li class="chapter-item expanded "><a href="7d-install-wordpress.html"><strong aria-hidden="true">7.4.</strong> Installing WordPress</a></li></ol></li><li class="chapter-item expanded "><a href="p8-conclusion.html"><strong aria-hidden="true">8.</strong> Conclusion</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
