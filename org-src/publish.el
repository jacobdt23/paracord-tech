;;; publish.el --- org-publish config for the paracord/tech site -*- lexical-binding: t; -*-
;;
;; Usage (in Doom Emacs):
;;   1. M-x load-file RET publish.el RET     (loads this config into the running Emacs)
;;   2. M-x org-publish RET paracord-tech RET   (publishes the whole project)
;;
;; This regenerates index.html, paracord.html, tech.html, about.html, and
;; contact.html directly in the repo root from the .org sources in org-src/.
;; style.css and script.js are hand-written and untouched by this process.
;; After publishing, deploy exactly like before:
;;   git add -A && git commit -m "..." && git push

(require 'ox-publish)

(setq org-publish-project-alist
      '(("paracord-tech"
         :base-directory "~/paracord-tech/org-src"
         :base-extension "org"
         :publishing-directory "~/paracord-tech"
         :publishing-function org-html-publish-to-html
         :recursive nil

         ;; Keep output clean/minimal — no Org boilerplate we didn't write
         :html-doctype "html5"
         :html-html5-fancy t
         :with-toc nil
         :section-numbers nil
         :with-author nil
         :with-date nil
         :with-creator nil
         :html-preamble nil
         :html-postamble nil
         :html-head-include-default-style nil
         :html-head-include-scripts nil)))

;; Optional: run all of this non-interactively from the command line instead
;; of inside a running Emacs session:
;;   emacs --batch -l ~/paracord-tech/org-src/publish.el \
;;         --eval '(org-publish "paracord-tech" t)'
;; The trailing t forces a full rebuild of every page, ignoring the
;; timestamp cache — worth using the first few times until you trust it.
