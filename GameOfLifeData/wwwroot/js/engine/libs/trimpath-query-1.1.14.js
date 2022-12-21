/**
 * TrimPath Query. Release 1.1.14.
 * Copyright (C) 2004 - 2007 TrimPath.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 */
typeof TrimPath == "undefined" && (TrimPath = {});
(function () {
    var v = eval, y = String, L = Array;
    TrimPath == null && (TrimPath = {});
    if (TrimPath.TEST == null)TrimPath.TEST = {};
    var M = function (e) {
            for (var d = [], b = 0; b < e.length; b++)C(d, e[b]) == !1 && d.push(e[b]);
            return d
        }, C = function (e, d) {
            for (var b = 0; b < e.length; b++)if (e[b] == d)return!0;
            return!1
        }, D = function (e, d) {
            for (var b = ["{"], g = 0; g < e.length; g++)g > 0 && b.push(","), b.push(e[g]), b.push(":"), d[g] ? (b.push('"'), b.push(d[g].replace(/(["\\])/g, "\\$1").replace(/\r/g, "").replace(/\n/g, "\\n")), b.push('"')) : b.push(null);
            b.push("}");
            return b.join("")
        },
        E = function (e) {
            var d = [], b;
            for (b in e)d.push(b);
            return d
        }, N = function (e) {
            var d = [], b;
            for (b in e)d.push(e[b]);
            return d
        };
    TrimPath.makeQueryLang_etc = {};
    TrimPath.makeQueryLang_etc.Error = function (e, d) {
        this.message = e;
        this.stmt = d
    };
    TrimPath.makeQueryLang_etc.Error.prototype.toString = function () {
        return"TrimPath query Error in " + (this.stmt != null ? this.stmt : "[unknown]") + ": " + this.message
    };
    var j = function () {
        throw"currently unsupported";
    }, s = function () {
        throw"incorrect keyword usage";
    }, F = function () {
    };
    TrimPath.makeQueryLang =
        function (e, d) {
            if (d == null)d = TrimPath.makeQueryLang_etc;
            var b = [], g = function (a, e, i) {
                if (e[a] != null)throw new d.Error("alias redefinition: " + a);
                b.push({aliasKey:a, scope:e, orig:e[a]});
                return e[a] = i
            }, f = new F, k = function (a, b, i, e, c) {
                a = G(a);
                b == null && (b = 1);
                if (a == null || a.length < b)throw new d.Error("not enough arguments for " + e);
                if (i != null && a.length > i)throw new d.Error("too many arguments for " + e);
                if (c != null)for (var f in a)if (typeof a[f] != "function" && a[f]instanceof c == !1)throw new d.Error("wrong type for " + a[f] +
                    " to " + e);
                return a
            }, h = function (a, b, i, e) {
                a[b] && (a[b].type && a[b].type == "Number" ? i = Number(i, 10) : a[b].type && a[b].type == "Date" && (a = i, typeof a == "string" && a.match(/\d{4}-\d{1,2}-\d{1,2}/) ? (a = a.match(/\d{4}-\d{1,2}-\d{1,2}/)[0].split("-"), i = new Date(parseInt(a[0], 10), parseInt(a[1], 10) - 1, parseInt(a[2], 10))) : i = a), e[b] = i)
            }, c = {select:function (a) {
                for (var e = [], i = {from:null, where:null, groupBy:null, having:null, orderBy:null, limit:null}, f = 0; f < a.length; f++) {
                    var g = a[f], h = !1, w;
                    for (w in i)if (g instanceof c[w]) {
                        if (i[w] !=
                            null)throw new d.Error("too many " + w.toUpperCase() + " clauses");
                        i[w] = g;
                        h = !0;
                        break
                    }
                    h == !1 && e.push(g)
                }
                e = k(e, 1, null, "COLUMNS");
                if (i.from == null)throw new d.Error("missing FROM clause");
                var j = null, o = null, z = null, n = null, m = null, r = null, t = null, s = function (a) {
                    for (var i = 0; i < a.length; i++) {
                        var e = a[i], b;
                        for (b in e) {
                            var c = e[b];
                            if (c instanceof Date) {
                                var d = a[i], f = b, p;
                                typeof c == "object" ? p = [c.getFullYear(), "-", c.getMonth() + 1, "-", c.getDate()].join("") : c == null && (p = null);
                                d[f] = p
                            }
                        }
                    }
                };
                this.prepareFilter = function () {
                    if (j == null) {
                        for (var a =
                            i.from.tables, b = ["var TrimPath_query_tmpJD = function(dataTables, joinFilter, whereFilter, bindings) {", "var result = [], filterArgs = [ bindings ];"], c = 0; c < a.length; c++)b.push("var T" + c + " = dataTables['" + a[c][".name"] + "'] || [];");
                        for (c = 0; c < a.length; c++)b.push("for (var t" + c + " = 0; t" + c + " < T" + c + ".length; t" + c + "++) {"), b.push("var resultLength" + c + " = result.length;"), b.push("filterArgs[" + (c + 1) + "] = T" + c + "[t" + c + "];");
                        b.push("if ((joinFilter == null || joinFilter.apply(null, filterArgs) == true) && ");
                        b.push("    (whereFilter == null || whereFilter.apply(null, filterArgs) == true))");
                        b.push("result.push(filterArgs.slice(0));");
                        for (c = a.length - 1; c >= 0; c--)if (b.push("}"), c >= 1 && a[c].joinType == "LEFT OUTER") {
                            b.push("if (resultLength" + (c - 1) + " == result.length) {");
                            for (var d = c; d < a.length; d++)b.push("filterArgs[" + (d + 1) + "] = ");
                            b.push("{}; if (whereFilter == null || whereFilter.apply(null, filterArgs) == true) result.push(filterArgs.slice(0)); }")
                        }
                        b.push("return result; }; TrimPath_query_tmpJD");
                        j = v(b.join(""))
                    }
                    o ==
                        null && (o = A(O, i.from.tables));
                    z == null && (z = A(H, i.from.tables, i.where != null ? i.where.exprs : null));
                    if (r == null && i.groupBy != null) {
                        a = i.from.tables;
                        b = i.groupBy.exprs;
                        c = ["var TrimPath_query_tmpGC = function(_BINDINGS"];
                        for (d = 0; d < a.length; d++)c.push(", " + a[d][".alias"]);
                        c.push("){ var _RESULT = [];");
                        for (d = 0; d < b.length; d++)c.push("_RESULT.push("), c.push(u(b[d])), c.push(");");
                        c.push("return _RESULT; }; TrimPath_query_tmpGC");
                        r = v(c.join(""))
                    }
                    t == null && i.having != null && (t = A(H, [], i.having.exprs, {aliasOnly:!0}));
                    if (n ==
                        null) {
                        for (var a = i.from.tables, b = e, c = ["var TrimPath_query_tmpCC = function(_BINDINGS, "], d = [], f = 0; f < a.length; f++)d.push(a[f][".alias"]);
                        c.push(M(d).join(", "));
                        c.push(", with_table){ with(_BINDINGS) {");
                        c.push("var _RESULT = {};");
                        c.push("if(with_table) {");
                        B(c, b, !0);
                        c.push("} else {");
                        B(c, b, !1);
                        c.push("}");
                        c.push("return _RESULT; }}; TrimPath_query_tmpCC");
                        n = v(c.join(""))
                    }
                    if (m == null && i.orderBy != null) {
                        a = i.orderBy.exprs;
                        b = ["var TrimPath_query_tmpOC = function(A, B) { var a, b; "];
                        for (c = 0; c < a.length; c++)d =
                            a[c], d.tableDef ? (b.push("a = A['" + d[".alias"] + "'] || A['" + d.tableDef[".alias"] + "." + d[".alias"] + "'] || '';"), b.push("b = B['" + d[".alias"] + "'] || B['" + d.tableDef[".alias"] + "." + d[".alias"] + "'] || '';")) : (b.push("a = A['" + d[".alias"] + "'] || '';"), b.push("b = B['" + d[".alias"] + "'] || '';")), d = d.order == "DESC" ? -1 : 1, b.push("if (a.valueOf() < b.valueOf()) return " + d * -1 + ";"), b.push("if (a.valueOf() > b.valueOf()) return " + d * 1 + ";");
                        b.push("return 0; }; TrimPath_query_tmpOC");
                        m = v(b.join(""))
                    }
                };
                this.filter = function (a, c, b) {
                    this.prepareFilter();
                    c == null && (c = {});
                    b == null && (b = {});
                    c = j(a, o, z, c);
                    if (r != null) {
                        for (var d = 0; d < c.length; d++)c[d].groupByValues = r.apply(null, c[d]);
                        c.sort(I)
                    }
                    if (b.return_reference)return c;
                    for (var e = {}, f = {SUM:function (a, c) {
                        e[a] = (e[a] != null ? e[a] : 0) + (c != null ? c : 0);
                        return e[a]
                    }, COUNT:function (a) {
                        e[a] = (e[a] != null ? e[a] : 0) + 1;
                        return e[a]
                    }, AVG:function (a, c) {
                        return f.SUM(a, c) / f.COUNT("_COUNT" + a)
                    }}, a = [], p = null, g, d = 0; d < c.length; d++)g = c[d], g[0] = f, p != null && I(p, g) != 0 && ((t == null || t(p.record) == !0) && a.push(p.record),
                        e = {}), g.record = n.apply(null, g.concat([b.with_table])), p = g;
                    p != null && (t == null || t(p.record) == !0) && a.push(p.record);
                    m != null && a.sort(m);
                    if (i.limit != null) {
                        if (i.limit.total == 0)return[];
                        b = i.limit.offset != null ? i.limit.offset : 0;
                        a = a.slice(b, b + (i.limit.total > 0 ? i.limit.total : a.length))
                    }
                    s(a);
                    return a
                };
                l(this, function () {
                    var a = ["SELECT", q(e, J).join(", "), i.from.toSql()];
                    i.where != null && a.push(i.where.toSql());
                    i.groupBy != null && a.push(i.groupBy.toSql());
                    i.having != null && a.push(i.having.toSql());
                    i.orderBy != null && a.push(i.orderBy.toSql());
                    i.limit != null && a.push(i.limit.toSql());
                    return a.join(" ")
                });
                for (f = 0; f < b.length; f++)a = b[f], a.scope[a.aliasKey] = a.orig;
                b = []
            }, insert:function (a) {
                var c = a[0], b = a[1];
                this.filter = function (a) {
                    var d = c[".name"];
                    a[d] || (a[d] = []);
                    a[d].push({});
                    for (var e in b)h(c, e, b[e], a[d][a[d].length - 1]);
                    return!0
                };
                l(this, function () {
                    return["INSERT INTO", c.toSql(), "(" + E(b).join(", ") + ")", "VALUES", "(" + N(b).join(", ") + ")"].join(" ")
                })
            }, update:function (a) {
                var c = a[0], b = a[1], d = a[2];
                this.filter = function (a) {
                    for (var e = c.tables[0], a = f.SELECT(c,
                        d, 1).filter(a, null, {return_reference:!0}), g = 0; g < a.length; g++) {
                        var l = a[g][1], k;
                        for (k in b) {
                            var j = k.split("."), o = k;
                            j.length == 2 && (o = j[1]);
                            h(e, o, b[k], l)
                        }
                    }
                    return!0
                };
                l(this, function () {
                    var a = ["UPDATE", c.toSql()], e = [], f;
                    for (f in b)e.push(f + "=" + b[f]);
                    a.push(e.join(", "));
                    d != null && a.push(d.toSql());
                    return a.join(" ")
                })
            }, destroy:function (a) {
                var c = a[0];
                this.filter = function (a) {
                    for (var b = c.filter(a, null, {return_reference:!0}), d = 0; d < b.length; d++)for (var e = b[d], f = 1; f < e.length; f++) {
                        var g = e[f], h;
                        for (h in g)delete g[h]
                    }
                    for (var k in a) {
                        b =
                            a[k];
                        for (d = 0; d < b.length; d++)E(b[d]).length == 0 && delete b[d]
                    }
                    for (k in a) {
                        d = a;
                        b = k;
                        e = a[k];
                        f = [];
                        for (g = 0; g < e.length; g++)e[g] != null && f.push(e[g]);
                        d[b] = f
                    }
                    return!0
                };
                l(this, function () {
                    return["DELETE", c.toSql()].join(" ").replace(/SELECT\s/, "")
                })
            }, from:function (a) {
                this.tables = k(a, 1, null, "FROM", c.tableDef)
            }, where:function (a) {
                this.exprs = k(a, 1, null, "WHERE", c.expression)
            }, groupBy:function (a) {
                this.exprs = k(a, 1, null, "GROUP_BY")
            }, having:function (a) {
                this.exprs = k(a, 1, null, "HAVING", c.expression)
            }, orderBy:function (a) {
                this.exprs =
                    k(a, 1, null, "ORDER_BY")
            }, expression:function (a, c, b, d, e, h, o, n) {
                var m = this;
                this.args = k(a, e, h, c);
                this[".name"] = c;
                this[".alias"] = n != null ? n : c;
                this.opFix = b;
                this.sqlText = d != null ? d : this[".name"];
                this.jsText = o != null ? o : this.sqlText;
                this.AS = function (a) {
                    this[".alias"] = this.ASC[".alias"] = this.DESC[".alias"] = a;
                    return g(a, f, this)
                };
                this.ASC = l({".name":c, ".alias":m[".alias"], order:"ASC"}, function () {
                    return m[".alias"] + " ASC"
                });
                this.DESC = l({".name":c, ".alias":m[".alias"], order:"DESC"}, function () {
                    return m[".alias"] + " DESC"
                });
                this.COLLATE = j
            }, aggregate:function () {
                c.expression.apply(this, arguments)
            }, limit:function (a, c) {
                c == null ? this.total = x(a) : (this.total = x(c), this.offset = x(a))
            }, tableDef:function (a, b, d) {
                this[".name"] = a;
                this[".alias"] = d != null ? d : a;
                this[".allColumns"] = [];
                for (var e in b)this[e] = new c.columnDef(e, b[e], this), this[".allColumns"].push(this[e]);
                l(this, function () {
                    return a
                });
                this.AS = function (d) {
                    return g(d, f, new c.tableDef(a, b, d))
                };
                this.ALL = new c.columnDef("*", null, this);
                this.ALL.AS = null
            }, columnDef:function (a, b, d, e) {
                var h =
                    this;
                this[".name"] = a;
                this[".alias"] = e != null ? e : a;
                this.tableDef = d;
                l(this, function (c) {
                    if (c != null && c.aliasOnly == !0)return this[".alias"];
                    return d != null ? d[".alias"] + "." + a : a
                });
                this.AS = function (e) {
                    return g(e, f, new c.columnDef(a, b, d, e))
                };
                this.type = b && b.type ? b.type : "String";
                this.ASC = l({".name":a, ".alias":h[".alias"], tableDef:d, order:"ASC"}, function () {
                    return h.toSql() + " ASC"
                });
                this.DESC = l({".name":a, ".alias":h[".alias"], tableDef:d, order:"DESC"}, function () {
                    return h.toSql() + " DESC"
                });
                this.COLLATE = j
            }, join:function (a, c) {
                var b = this;
                this.joinType = a;
                this.fromSeparator = " " + a + " JOIN ";
                for (var d in c)this[d] = c[d];
                this.ON = function () {
                    b.ON_exprs = k(arguments, 1, null, "ON");
                    return b
                };
                this.USING = function () {
                    b.USING_exprs = G(arguments, !1);
                    return b
                };
                this.fromSuffix = function () {
                    if (b.ON_exprs != null)return" ON " + q(b.ON_exprs, r).join(" AND ");
                    if (b.USING_exprs != null)return" USING (" + b.USING_exprs.join(", ") + ")";
                    return""
                }
            }}, l = function (a, c) {
                a.toSql = a.toJs = a.toString = c;
                return a
            };
            l(c.from.prototype, function () {
                for (var a = ["FROM "], c = 0; c < this.tables.length; c++) {
                    if (c >
                        0) {
                        var b = this.tables[c].fromSeparator;
                        b == null && (b = ", ");
                        a.push(b)
                    }
                    a.push(J(this.tables[c]));
                    this.tables[c].fromSuffix != null && a.push(this.tables[c].fromSuffix())
                }
                return a.join("")
            });
            l(c.where.prototype, function () {
                return"WHERE " + q(this.exprs, r).join(" AND ")
            });
            l(c.orderBy.prototype, function () {
                return"ORDER BY " + q(this.exprs, r).join(", ")
            });
            l(c.groupBy.prototype, function () {
                return"GROUP BY " + q(this.exprs, r).join(", ")
            });
            l(c.having.prototype, function () {
                return"HAVING " + q(this.exprs, r, {aliasOnly:!0}).join(" AND ")
            });
            l(c.limit.prototype, function () {
                return"LIMIT " + (this.total < 0 ? "ALL" : this.total) + (this.offset != null ? " OFFSET " + this.offset : "")
            });
            var o = function (a, c) {
                return function (b) {
                    if (b != null && b.aliasOnly == !0 && this[".alias"] != this[".name"])return this[".alias"];
                    if (this.opFix < 0)return this[c] + " (" + q(this.args, a, b).join(") " + this[c] + " (") + ")";
                    if (this.opFix > 0)return"(" + q(this.args, a, b).join(") " + this[c] + " (") + ") " + this[c];
                    return"(" + q(this.args, a, b).join(") " + this[c] + " (") + ")"
                }
            };
            c.expression.prototype.toSql = o(r, "sqlText");
            c.expression.prototype.toJs = o(u, "jsText");
            c.aggregate.prototype = new c.expression([], null, null, null, 0);
            c.aggregate.prototype.toJs = function (a) {
                if (a != null && a.aliasOnly == !0 && this[".alias"] != this[".name"])return this[".alias"];
                return this.jsText + " ('" + this[".alias"] + "', (" + q(this.args, u).join("), (") + "))"
            };
            c.join.prototype = new c.tableDef;
            c.whereSql = function (a) {
                this.exprs = [new c.rawSql(a)]
            };
            c.whereSql.prototype = new c.where([new c.expression([0], null, 0, null, 0, null, null, null)]);
            c.havingSql = function (a) {
                this.exprs =
                    [new c.rawSql(a)]
            };
            c.havingSql.prototype = new c.having([new c.expression([0], null, 0, null, 0, null, null, null)]);
            c.rawSql = function (a) {
                this.sql = a
            };
            c.rawSql.prototype.toSql = function () {
                return this.sql
            };
            c.rawSql.prototype.toJs = function () {
                for (var a = this.sql, a = a.replace(/ AND /g, " && "), a = a.replace(/ OR /g, " || "), a = a.replace(/ = /g, " == "), a = a.replace(/ IS NULL/g, " == null"), a = a.replace(/ IS NOT NULL/g, " != null"), a = a.replace(/ NOT /g, " ! "), c = /(\S+)\sLIKE\s'(\S+)'/g, b; b = c.exec(a);)b[2] = b[2].replace(/%/, ".*"),
                    a = a.replace(c, "$1.match(/" + b[2] + "/)");
                for (c = /'(\d{4})-(\d{1,2})-(\d{1,2})'/g; b = c.exec(a);)var d = "(new Date(" + [parseInt(b[1], 10).toString(), (parseInt(b[2], 10) - 1).toString(), parseInt(b[3], 10).toString()].join(", ") + ").valueOf())", a = a.replace(b[0], d);
                return a
            };
            o = {INSERT:function () {
                return new c.insert(arguments)
            }, UPDATE:function () {
                return new c.update(arguments)
            }, DESTROY:function () {
                return new c.destroy(arguments)
            }, SELECT_ALL:function () {
                return new c.select(arguments)
            }, SELECT_DISTINCT:j, ALL:s, FROM:function () {
                return new c.from(arguments)
            },
                WHERE:function () {
                    return new c.where(arguments)
                }, AND:function () {
                    return new c.expression(arguments, "AND", 0, null, 1, null, "&&")
                }, OR:function () {
                    return new c.expression(arguments, "OR", 0, null, 1, null, "||")
                }, NOT:function () {
                    return new c.expression(arguments, "NOT", -1, null, 1, 1, "!")
                }, EQ:function () {
                    return new c.expression(arguments, "EQ", 0, "=", 2, 2, "==")
                }, NEQ:function () {
                    return new c.expression(arguments, "NEQ", 0, "!=", 2, 2)
                }, LT:function () {
                    return new c.expression(arguments, "LT", 0, "<", 2, 2)
                }, GT:function () {
                    return new c.expression(arguments,
                        "GT", 0, ">", 2, 2)
                }, LTE:function () {
                    return new c.expression(arguments, "LTE", 0, "<=", 2, 2)
                }, GTE:function () {
                    return new c.expression(arguments, "GTE", 0, ">=", 2, 2)
                }, IS_NULL:function () {
                    return new c.expression(arguments, "IS_NULL", 1, "IS NULL", 1, 1, "== null")
                }, IS_NOT_NULL:function () {
                    return new c.expression(arguments, "IS_NOT_NULL", 1, "IS NOT NULL", 1, 1, "!= null")
                }, ADD:function () {
                    return new c.expression(arguments, "ADD", 0, "+", 2, null)
                }, SUBTRACT:function () {
                    return new c.expression(arguments, "SUBTRACT", 0, "-", 2, null)
                }, NEGATE:function () {
                    return new c.expression(arguments,
                        "NEGATE", -1, "-", 1, 1)
                }, MULTIPLY:function () {
                    return new c.expression(arguments, "MULTIPLY", 0, "*", 2, null)
                }, DIVIDE:function () {
                    return new c.expression(arguments, "DIVIDE", 0, "/", 2, null)
                }, PAREN:function () {
                    return new c.expression(arguments, "PAREN", 0, "", 1, 1)
                }, LIKE:function () {
                    return new c.expression(arguments, "LIKE", 0, "LIKE", 2, 2, "match")
                }, BETWEEN:j, AVG:function () {
                    return new c.aggregate(arguments, "AVG", -1, null, 1, 1)
                }, AVG_ALL:j, AVG_DISTINCT:j, SUM:function () {
                    return new c.aggregate(arguments, "SUM", -1, null, 1, 1)
                }, SUM_ALL:j,
                SUM_DISTINCT:j, COUNT:function () {
                    return new c.aggregate(arguments, "COUNT", -1, null, 1, 1)
                }, COUNT_ALL:j, COUNT_DISTINCT:j, AS:s, IN:j, UNION:j, UNION_ALL:j, EXCEPT:j, EXCEPT_ALL:j, INTERSECT:j, INTERSECT_ALL:j, CROSS_JOIN:function (a) {
                    return a
                }, INNER_JOIN:function (a) {
                    return new c.join("INNER", a)
                }, LEFT_OUTER_JOIN:function (a) {
                    return new c.join("LEFT OUTER", a)
                }, RIGHT_OUTER_JOIN:j, FULL_OUTER_JOIN:j, ON:s, USING:s, GROUP_BY:function () {
                    return new c.groupBy(arguments)
                }, HAVING:function () {
                    return new c.having(arguments)
                }, ORDER_BY:function () {
                    return new c.orderBy(arguments)
                },
                LIMIT:function (a, b) {
                    return new c.limit(a, b)
                }, LIMIT_ALL:function (a) {
                    return f.LIMIT(-1, a)
                }, OFFSET:s, ANY_SELECT:j, ALL_SELECT:j, EXISTS:j, WHERE_SQL:function (a) {
                    return new c.whereSql(a)
                }, HAVING_SQL:function (a) {
                    return new c.havingSql(a)
                }};
            o.SELECT = o.SELECT_ALL;
            for (var m in o)f[m] = o[m];
            for (var n in e)f[n] = new c.tableDef(n, e[n]);
            return f
        };
    var A = function (e, d, b, g) {
            for (var f = ["var TrimPath_query_tmpWF = function(_BINDINGS"], k = 0; k < d.length; k++)f.push(", " + d[k][".alias"]);
            f.push("){ with(_BINDINGS) {");
            e(f, d, b,
                g);
            f.push("return true; }}; TrimPath_query_tmpWF");
            return v(f.join(""))
        }, O = function (e, d) {
            for (var b = 0; b < d.length; b++)if (d[b].joinType != null && (d[b].ON_exprs != null || d[b].USING_exprs != null))e.push("if (!("), d[b].ON_exprs != null && d[b].ON_exprs[0].exprs != null ? e.push(d[b].ON_exprs[0].exprs[0].toJs()) : d[b].ON_exprs != null && e.push(q(d[b].ON_exprs, u).join(" && ")), d[b].USING_exprs != null && e.push(q(d[b].USING_exprs,function (e) {
                return"(" + d[b - 1][".alias"] + "." + e + " == " + d[b][".alias"] + "." + e + ")"
            }).join(" && ")), e.push(")) return false;")
        },
        H = function (e, d, b, g) {
            if (b != null) {
                e.push("if (!((");
                for (d = 0; d < b.length; d++)d > 0 && e.push(") && ("), e.push(u(b[d], g));
                e.push("))) return false;")
            }
        }, B = function (e, d, b) {
            for (var g = 0; g < d.length; g++) {
                var f = d[g];
                f[".name"] == "*" ? B(e, f.tableDef[".allColumns"], b) : (e.push("_RESULT['"), b == !0 ? e.push(f.toString()) : e.push(f[".alias"]), e.push("'] = ("), e.push(u(f)), e.push(");"))
            }
        }, I = function (e, d) {
            return P(e.groupByValues, d.groupByValues)
        }, P = function (e, d) {
            if (e == null || d == null)return-1;
            for (var b = 0; b < e.length && b < d.length; b++) {
                if (e[b] <
                    d[b])return-1;
                if (e[b] > d[b])return 1
            }
            return 0
        }, J = function (e, d) {
            var b = r(e, d);
            if (e[".alias"] != null && e[".alias"] != e[".name"])return b + " AS " + e[".alias"];
            return b
        }, r = function (e, d) {
            return K(e, "toSql", d)
        }, u = function (e, d) {
            return K(e, "toJs", d)
        }, K = function (e, d, b) {
            if (typeof e == "object" && e[d] != null)return e[d].call(e, b);
            return y(e)
        }, q = function (e, d, b) {
            for (var g = [], f = 0; f < e.length; f++)g.push(d(e[f], b));
            return g
        }, G = function (e, d) {
            for (var b = [], g = 0; g < e.length; g++)b.push(x(e[g], d));
            return b
        }, x = TrimPath.TEST.cleanString =
            function (e, d) {
                if (e instanceof y || typeof e == "string")e = y(e).replace(/\\/g, "\\\\").replace(/'/g, "\\'"), d != !1 && (e = "'" + e + "'");
                return e
            }, n = function (e, d) {
            var b = e.search(d);
            if (b < 0)b = e.length;
            return e.substring(0, b)
        };
    F.prototype.parseSQL = function (e, d) {
        var b = e.replace(/\n/g, " ").replace(/\r/g, "");
        if (d != null) {
            d instanceof L == !1 && (d = [d]);
            for (var g = b.split(" ?"), f = 0; f < g.length - 1; f++)g[f] = g[f] + " " + x(d[f], !0);
            b = g.join("")
        }
        var b = b.replace(/ AS ([_a-zA-z0-9]+)/g, ".AS('$1')"), k = function (b) {
            throw"[ERROR: " + b + " in query: " +
                e + "]";
        }, g = b.split(/\s+/)[0];
        g == "DELETE" && (g = "DESTROY");
        C(["SELECT", "DESTROY", "UPDATE", "INSERT"], g) || k("not a valid query type");
        if (g == "SELECT" || g == "DESTROY") {
            f = b.substring(7).split(" FROM ");
            f.length != 2 && k("missing a FROM clause");
            for (var b = f[0].replace(/\.\*/g, ".ALL"), h = f[1], k = n(h, /\sWHERE\s|\sGROUP BY\s|\sHAVING\s|\sORDER BY\s|\sLIMIT/), c = n(k, /\sLEFT OUTER JOIN\s/).replace(/\s+/g, "").split(","), h = h.substring(k.length), k = k.split(" LEFT OUTER JOIN "), l = [k[0]], j, f = 1; f < k.length; f++)j = /(\w+)\sON\s(.+)/.exec(k[f]),
                c.push(j[1]), l.push("(" + j[1] + ').ON(WHERE_SQL("' + j[2] + '"))');
            k = l.join(", LEFT_OUTER_JOIN");
            if (b.replace(/\s+/g, "") == "*") {
                l = [];
                for (f = 0; f < c.length; f++)l.push(c[f] + ".ALL");
                b = b.replace(/\*/, l.join(", "))
            }
            c = n(h, /\sGROUP BY\s|\sHAVING\s|\sORDER BY\s|\sLIMIT/);
            h = h.substring(c.length);
            f = n(h, /\sHAVING\s|\sORDER BY\s|\sLIMIT /);
            h = h.substring(f.length);
            l = n(h, /\sORDER BY\s|\sLIMIT /);
            h = h.substring(l.length);
            j = n(h, /\sLIMIT /).replace(/\sASC/g, ".ASC").replace(/\sDESC/g, ".DESC");
            var m = h = h.substring(j.length), h = ["SELECT(FROM(",
                k, "), ", b];
            c.length > 0 && h.push(', WHERE_SQL("' + c.substring(7) + '")');
            f.length > 0 && h.push(", GROUP_BY(" + f.substring(10) + ")");
            l.length > 0 && h.push(', HAVING_SQL("' + l.substring(8) + '")');
            j.length > 0 && h.push(", ORDER_BY(" + j.substring(10) + ")");
            m.length > 0 && h.push(", LIMIT(" + m.substring(7) + ")");
            h.push(")")
        } else if (g == "INSERT")f = b.substring(6).split(" INTO "), f.length != 2 && k("missing an INTO clause"), f = f[1].match(/^\s*(\w+)\s*\((.+)\)\s+VALUES\s+\((.+)\)/), c = f[1], h = f[2].replace(/\s+/g, "").split(","), l = (new Function("var o=[], a=" +
            ("[" + f[3] + "]") + "; while(a.length>0) { o.push(a.shift().toString()); } return o;"))(), h.length != l.length && k("values and fields must have same number of elements"), h = ["INSERT(", c, ",", D(h, l), ")"]; else if (g == "UPDATE") {
            f = b.substring(7).split(" SET ");
            f.length != 2 && k("missing a SET clause");
            k = f[0];
            h = f[1];
            f = n(h, /\sWHERE\s/);
            c = h = h.substring(f.length);
            j = f.split(",");
            h = [];
            l = [];
            for (f = 0; f < j.length; f++)m = j[f].split("="), h.push(m[0].replace(/^\s+/, "").replace(/\s+$/, "")), l.push(m[1].replace(/^\s+/, "").replace(/\s+$/,
                ""));
            f = b.match(/^UPDATE\s+(\w+)\s+SET\s+(\w+\s*=\s*\w+)/);
            h = ["UPDATE(FROM(", k, "), ", D(h, l)];
            h.push(', WHERE_SQL("' + c.substring(7) + '")');
            h.push(")")
        }
        g == "DESTROY" && (h.unshift("DESTROY("), h.push(")"));
        with (this)return eval(h.join(""))
    }
})();