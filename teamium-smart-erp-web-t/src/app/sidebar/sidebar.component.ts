import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SidebarMenuItem } from '../core/entity/sidebarmenuitem';
import { Router, ActivatedRoute, UrlTree, PRIMARY_OUTLET, UrlSegmentGroup, UrlSegment } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { Location } from '@angular/common';
import { variable } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menu = [];
  @Output() activeMenuEmitter = new EventEmitter<string>();
  public activeMenu: any;
  public activeSubMenu: any;
  public currentUrl: string;
  public innerCurrentUrl: string;
  public previousActiveMenu: string;
  public projectId: string;
  public showDropdown: boolean;
  public previousLink: string;
  public showSidebarModal: boolean = false;
  public openModalRef: any;

  constructor(private location: Location, private translate: TranslateService, private router: Router, private dataService: DataService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.dataService.submenuSourceForBackItem.subscribe(router => {
      this.loadMenu(router);
    });

    this.dataService.openSubmenuItem.subscribe(message => {
      if (this.activeMenu) {
        if (message) {
          let s = message.slice(1, message.length).split('/');
          this.openMenu(s, message)
          this.router.navigate([message]);
        } else {
          this.previousActiveMenu = this.activeMenu;
          this.activeMenuEmitter.emit(this.activeMenu.title);
          this.currentUrl = this.activeMenu.defaultSubmenuUrl;

          let newUrl: string = this.currentUrl;
          let childLink = this.activeMenu.children.find(el => el.link == this.currentUrl);
          if (childLink.pathAttributes && this.dataService.pathVariable) {
            let variables = '';
            this.dataService.pathVariable.forEach(element => {
              childLink.pathAttributes.forEach(el => {
                if (element[el]) {
                  variables += '/' + element[el];
                }
              });
            });
            newUrl += variables
          }
          this.router.navigate([newUrl]);
        }
      }
    });
    this.menu = SidebarMenuItem;
    this.loadMenu(this.router);
  }

  loadMenu(router) {
    this.activeMenu = null;
    this.currentUrl = '';
    this.innerCurrentUrl = "";
    this.previousActiveMenu = '';
    this.showDropdown = true;
    this.activeMenuEmitter.emit(null)
    if (router.url) {
      const tree: UrlTree = router.parseUrl(router.url);
      const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
      const s: UrlSegment[] = g.segments;

      let s1 = [];
      s.forEach(e => s1.push(e.path));
      this.openMenu(s1, router.url);
    }
  }

  openMenu(s: any, url) {
    if (url && url.includes('/teamium/rate-card')) {
      url = "/teamium/rate-card";
    }
    if (!s[1]) {
      return;
    }
    for (let dt of this.menu) {
      this.activeMenu = dt;

      if (dt.defaultUrl && dt.defaultUrl == url) {
        if (dt.defalutSubmenuOpen) {
          this.activeSubMenu = null;
          this.dataService.openSubmenu();
        }
        return;
      }

      for (let ch of dt.children) {
        if (ch.link && ch.link.includes(s[1])) {
          let newUrl: string = "";
          if (ch.pathAttributes) {
            let arr = new Array(s.length - ch.pathAttributes.length);
            let j = 0;
            for (let i of arr) {
              newUrl += "/" + s[j];
              j = j + 1;
            }
          } else {
            newUrl = url;
          }
          if (ch.link == newUrl) {
            this.activeSubMenu = null;
            this.previousLink = newUrl;
            this.currentUrl = ch.link;
            this.activeMenuEmitter.emit(this.activeMenu.title);
            this.showDropdown = false;
            return;
          }
        }
        if (ch.children) {
          for (let ch1 of ch.children) {
            if (ch1.link && ch1.link.includes(s[1])) {
              let newUrl: string = "";
              if (ch1.pathAttributes) {
                let arr = new Array(s.length - ch.pathAttributes.length);
                let j = 0;
                for (let i of arr) {
                  newUrl += "/" + s[j];
                  j = j + 1;
                }
              } else {
                newUrl = url;
              }
              if (ch1.link == newUrl) {
                this.activeSubMenu = ch;
                this.previousLink = newUrl;
                this.innerCurrentUrl = ch1.link;
                this.currentUrl = ch.link;
                this.activeMenuEmitter.emit(this.activeMenu.title);
                this.showDropdown = true;
                return;
              }
            }
          }
        }
      }
    }
  }

  useLanguage(language: string) {
    this.translate.use(language);
    sessionStorage.setItem("selectedLanguage", language);
  }

  changeMenuItem(item) {
    this.activeMenu = item;
    if (this.previousActiveMenu || this.previousActiveMenu != this.activeMenu) {
      this.activeMenuEmitter.emit(null)
    }
    if (item.defalutSubmenuOpen) {
      this.dataService.openSubmenu();
    } else {
      this.currentUrl = item.defaultUrl;
      this.router.navigate([this.currentUrl]);
    }
    this.activeSubMenu = null;
  }

  navigate(submenu) {
    if (submenu && submenu.link) {
      this.activeSubMenu = submenu;
      let variables = '';
      let newUrl: string = submenu.link;
      if (submenu.pathAttributes && this.dataService.pathVariable) {
        this.dataService.pathVariable.forEach(element => {
          submenu.pathAttributes.forEach(el => {
            if (element[el]) {
              variables += '/' + element[el];
              this.projectId = variables;
            }
          });
        });
        newUrl += variables
      }
      if (this.previousLink == submenu.link) {
        if (submenu.children) {
          this.showDropdown = !this.showDropdown;
          if (this.showDropdown) {
            let url = submenu.defaultSubmenuUrl + "" + (submenu.subPathAttributes ? variables : "");
            this.router.navigate([url]);
          }
        }
        return;
      }
      this.previousLink = submenu.link;
      this.router.navigate([newUrl]);
    }
    else {
      this.activeSubMenu = null;
    }
  }

  onMouseOver = () => {
    this.openModalRef = setTimeout(() => {
      this.showSidebarModal = true;
    }, 2000)
  }

  onMouseOut = () => {
    clearTimeout(this.openModalRef);
  }





  hideSidebarModal = ($event) => {
    this.showSidebarModal = false;
  }

}